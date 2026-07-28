import http from "k6/http";

export const options = {
    stages: [
        { duration: "1m", target: 100 },
        { duration: "1m", target: 300 },
        { duration: "1m", target: 500 },
        { duration: "1m", target: 800 },
        { duration: "1m", target: 1000 },
        { duration: "30s", target: 0 },
    ],
};

export default function () {
    http.get("https://kayducate-api.kaylynk.tech/health");
}