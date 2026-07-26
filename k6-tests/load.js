import http from "k6/http";

export const options = {
    stages: [
        { duration: "30s", target: 200 },
        { duration: "2m", target: 500 },
        { duration: "30s", target: 0 },
    ],
};

export default function () {
    http.get("https://kayducate-api.kaylynk.tech/health");
}