require("dotenv").config();

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_DB_URI;
const BACKUP_DIR = process.env.BACKUP_DIR || "./backups";

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
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const filename = `${DB_NAME}_${formatDate()}.gz`;
        const filepath = path.join(BACKUP_DIR, filename);

        const command = `mongodump --uri="${MONGO_URI}" --archive="${filepath}" --gzip`;

        console.log("Creating backup...");

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(error.message);
                process.exit(1);
            }

            if (stderr) {
                console.log(stderr);
            }

            console.log("Backup created:");
            console.log(filepath);

            // Upload using rclone
            const upload = `rclone copy "${filepath}" gdrive:mongodb-backups`;

            console.log("Uploading to Google Drive...");

            exec(upload, (err) => {
                if (err) {
                    console.error("Upload failed");
                    console.error(err.message);
                    process.exit(1);
                }

                console.log("Upload completed.");

                // Optional: Delete local backup after upload
                fs.unlinkSync(filepath);
                console.log("Local backup removed.");
            });
        });

    } catch (err) {
        console.error(err);
    }
})();