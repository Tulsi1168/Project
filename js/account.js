/* =====================================================
   BITE ADDA
   ACCOUNT PAGE
===================================================== */


/* =====================================================
   LOAD ACCOUNT
===================================================== */

function loadAccount() {

    console.log("ACCOUNT.JS IS RUNNING");


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "biteAddaCurrentUser"
            )
        );


    console.log(
        "CURRENT USER:",
        currentUser
    );


    /* USER NOT LOGGED IN */

    if (!currentUser) {

        window.location.href =
            "login.html";

        return;

    }


    /* =================================================
       SHOW USER DETAILS
    ================================================= */

    document.getElementById(
        "accountName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "accountFullName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "accountEmail"
    ).textContent =
        currentUser.email;


    document.getElementById(
        "accountPhone"
    ).textContent =
        currentUser.phone;


    /* =================================================
       SHOW ORDER HISTORY
    ================================================= */

    displayOrderHistory(
        currentUser.orders || []
    );

}


/* =====================================================
   DISPLAY ORDER HISTORY
===================================================== */

function displayOrderHistory(orders) {

    const container =
        document.getElementById(
            "orderHistory"
        );


    if (!container) {

        console.log(
            "orderHistory element not found"
        );

        return;

    }


    /* CLEAR LOADING MESSAGE */

    container.innerHTML = "";


    /* =================================================
       NO ORDERS
    ================================================= */

    if (
        !orders ||
        orders.length === 0
    ) {

        container.innerHTML = `

            <p>
                You haven't placed any orders yet.
            </p>

            <a
                href="menu.html"
                class="btn btn-red">

                ORDER NOW

            </a>

        `;

        return;

    }


    /* =================================================
       DISPLAY ORDERS
    ================================================= */

    orders
        .slice()
        .reverse()
        .forEach(function (order) {

            const orderCard =
                document.createElement(
                    "div"
                );


            orderCard.className =
                "order-history-card";


            /* ITEMS */

            let itemHTML = "";


            if (order.items) {

                order.items.forEach(
                    function (item) {

                        itemHTML += `

                            <li>
                                ${item.name}
                                × ${item.quantity}
                            </li>

                        `;

                    }
                );

            }


            /* ORDER TYPE */

            let orderType =
                order.type || "Order";


            if (
                order.type ===
                "delivery"
            ) {

                orderType =
                    "🛵 Delivery";

            }

            else if (
                order.type ===
                "takeaway"
            ) {

                orderType =
                    "🥡 Takeaway";

            }

            else if (
                order.type ===
                "dinein"
            ) {

                orderType =
                    "🍽️ Dine-In";

            }


            /* ORDER CARD */

            orderCard.innerHTML = `

                <div class="order-history-header">

                    <strong>
                        ${order.orderId || "Order"}
                    </strong>

                    <span>
                        ${orderType}
                    </span>

                </div>


                <div class="order-history-items">

                    <ul>
                        ${itemHTML}
                    </ul>

                </div>


                <div class="order-history-footer">

                    <strong>
                        Total: ৳${order.total || 0}
                    </strong>

                    <a
                        href="track.html"
                        class="btn btn-red">

                        TRACK ORDER

                    </a>

                </div>

            `;


            container.appendChild(
                orderCard
            );

        });

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem(
        "biteAddaCurrentUser"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   START ACCOUNT PAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAccount();

    }
);