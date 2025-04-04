const base64 = require('base-64');
const baseUrl = "https://api-m.sandbox.paypal.com";

const clientId = 'Ad3MJUc1beu14XGfzcCLVjnavu5GRqxJGcGTYpJVhPbmYcQDT5A3s0EVTrO9IcATeeJpXvig_DLeeONE';
const clientSecret = 'EGkXPnS4tRhZWmV0DJP6Ln3OpfM-PGKeP7ubR8Fkj5JQQSN0wySDaA69LnjWKOuVl64j3FQDC6j7jjXx';

export const generateToken = () => {
    const headers = new Headers();
    headers.append('Content-Type', "application/x-www-form-urlencoded");
    headers.append('Authorization', "Basic " + base64.encode(`${clientId}:${clientSecret}`));

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: "grant_type=client_credentials",
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + "/v1/oauth2/token", requestOptions).then(res => res.text()).then(result => {
            const { access_token } = JSON.parse(result);
            resolve(access_token);
        }).catch(err => {
            console.log("Error", err);
            reject(err);
        })
    });
}

export const subscribe = (token, title, desc, price) => {
    const orderDetails = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "items": [
                    {
                        "name": title,
                        "description": desc,
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": parseFloat(price).toFixed(2).toString()
                        }
                    }
                ],
                "amount": {
                    "currency_code": "USD",
                    "value": parseFloat(price).toFixed(2).toString(),
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": parseFloat(price).toFixed(2).toString(),
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://example.com/return",
            "cancel_url": "https://example.com/cancel",
        }
    }

    const headers = new Headers();
    headers.append('Content-Type', "application/json");
    headers.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderDetails),
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + "/v2/checkout/orders", requestOptions).then(res => res.text()).then(result => {
            resolve(JSON.parse(result));
        }).catch(err => {
            console.log("Error", err);
            reject(err);
        })
    });
}

export const captureSubscription = (id,  token) => {
    const headers = new Headers();
    headers.append('Content-Type', "application/json");
    headers.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
        method: "POST",
        headers: headers,
    }

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions).then(res => res.text()).then(result => {
            resolve(JSON.parse(result));
        }).catch(err => {
            console.log("Error", err);
            reject(err);
        })
    });
}