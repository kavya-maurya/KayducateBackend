import http from "k6/http";

export const options = {
    stages: [
        { duration: "20s", target: 10 },
        { duration: "10s", target: 300 },
        { duration: "1m", target: 300 },
        { duration: "10s", target: 10 },
        { duration: "30s", target: 0 },
    ],
};

export default function () {
    http.get("https://kayducate-api.kaylynk.tech/health");
}