require("dotenv").config();

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const logger = require("./config/logger");
const transporter = require("./config/mail");

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_DB_URI;
const BACKUP_DIR = process.env.BACKUP_DIR || "./backups";
const RECIPIENT_EMAIL = "kavyamaurya269@gmail.com";

function sendEmail(subject, text) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        logger.warn("Email credentials are not configured. Skipping notification email.");
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(
            {
                from: process.env.EMAIL_USER,
                to: RECIPIENT_EMAIL,
                subject,
                text,
            },
            (error, info) => {
                if (error) {
                    logger.error(`Failed to send email notification: ${error.message}`);
                    reject(error);
                    return;
                }

                logger.info(`Email notification sent: ${info.messageId}`);
                resolve(info);
            }
        );
    });
}

function formatDate() {
    const now = new Date();

    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}_${hh}-${mm}-${ss}`;
}

(async () => {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            logger.info(`Creating backup directory: ${BACKUP_DIR}`);
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const filename = `${DB_NAME}_${formatDate()}.gz`;
        const filepath = path.join(BACKUP_DIR, filename);

        const command = `mongodump --uri="${MONGO_URI}" --archive="${filepath}" --gzip`;

        logger.info("Starting MongoDB backup process...");
        logger.info(`Creating backup: ${filepath}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Backup failed: ${error.message}`);
                sendEmail(
                    "Backup failed",
                    `MongoDB backup failed.\nError: ${error.message}`
                ).catch(() => {});
                process.exit(1);
            }

            if (stderr) {
                logger.info(`mongodump output: ${stderr}`);
            }

            logger.info("Backup created successfully.");
            logger.info(`Backup file: ${filepath}`);

            // Upload using rclone
            const upload = `rclone copy "${filepath}" gdrive:mongodb-backups`;

            logger.info("Uploading backup to Google Drive...");

            exec(upload, (err) => {
                if (err) {
                    logger.error(`Upload failed: ${err.message}`);
                    sendEmail(
                        "Backup failed",
                        `MongoDB backup was created but upload failed.\nFile: ${filepath}\nError: ${err.message}`
                    ).catch(() => {});
                    process.exit(1);
                }

                logger.info("Upload completed successfully.");

                // Optional: Delete local backup after upload
                fs.unlinkSync(filepath);
                logger.info(`Local backup removed: ${filepath}`);

                sendEmail(
                    "Backup completed successfully",
                    `MongoDB backup completed successfully.\nFile: ${filepath}`
                ).catch(() => {});
            });
        });

    } catch (err) {
        logger.error(`Backup script failed: ${err.message}`);
        sendEmail(
            "Backup failed",
            `Backup script crashed unexpectedly.\nError: ${err.message}`
        ).catch(() => {});
    }
})();