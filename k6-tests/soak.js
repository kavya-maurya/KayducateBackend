import http from "k6/http";

export const options = {
    vus: 50,
    duration: "30m",
};

export default function () {
    http.get("https://kayducate-api.kaylynk.tech/health");
}