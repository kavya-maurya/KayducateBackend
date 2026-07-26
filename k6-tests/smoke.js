import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 1,
    iterations: 10,
};

export default function () {
    const res = http.get("https://kayducate-api.kaylynk.tech/health");

    check(res, {
        "status 200": (r) => r.status === 200,
    });
}