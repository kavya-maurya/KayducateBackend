import http from "k6/http";

export const options = {
    scenarios: {
        constant_rate: {
            executor: "constant-arrival-rate",
            rate: 100,
            timeUnit: "1s",
            duration: "5m",
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
};

export default function () {
    http.get("https://kayducate-api.kaylynk.tech/health");
}