
/* =====================================================
   BITE ADDA
   ADMIN JAVASCRIPT
   WITH CUSTOMER TRACKING BRIDGE
===================================================== */


/* =====================================================
   CHECK ADMIN LOGIN
===================================================== */

if (
    localStorage.getItem(
        "biteAddaAdminLoggedIn"
    ) !== "true"
) {

    window.location.href =
        "admin-login.html";

}


/* =====================================================
   GET CURRENT ORDER
===================================================== */

function getOrder() {

    const savedOrder =
        localStorage.getItem(
            "biteAddaLastOrder"
        );


    if (!savedOrder) {

        return null;

    }


    try {

        return JSON.parse(
            savedOrder
        );

    }

    catch (error) {

        console.log(
            "ORDER DATA ERROR:",
            error
        );

        return null;

    }

}


/* =====================================================
   GET ORDER ID
===================================================== */

function getOrderId(order) {

    if (!order) {

        return "N/A";

    }


    return (
        order.orderNumber ||
        order.orderId ||
        "N/A"
    );

}


/* =====================================================
   GET ORDER TYPE
===================================================== */

function getOrderType(order) {

    if (!order) {

        return "N/A";

    }


    const type =
        order.orderType ||
        order.type ||
        "";


    if (type === "delivery") {

        return "🛵 Delivery";

    }


    if (type === "takeaway") {

        return "🥡 Takeaway";

    }


    if (type === "dinein") {

        return "🍽️ Dine-In";

    }


    return type || "N/A";

}


/* =====================================================
   GET SAVED ADMIN STATUS
===================================================== */

function getOrderStatus(order) {

    if (!order) {

        return "Pending";

    }


    const orderId =
        getOrderId(order);


    const statusKey =
        "biteAddaStatus_" +
        orderId;


    return (
        localStorage.getItem(
            statusKey
        ) ||
        "Pending"
    );

}


/* =====================================================
   ⭐ CUSTOMER TRACKING BRIDGE
=====================================================

   The existing customer Track Order page
   looks for:

       biteAddaOrder

   and expects:

       orderId
       type
       currentStep

   We create that object here WITHOUT
   touching app.js.
===================================================== */

function updateCustomerTracking(
    order,
    status
) {

    if (!order) {

        return;

    }


    const orderId =
        getOrderId(order);


    /*
       Convert Admin status into
       the tracking timeline step.

       0 = Order Confirmed
       1 = Order Received
       2 = Preparing Your Food
       3 = Ready for Delivery
       4 = Out for Delivery
       5 = Delivered
    */

    let currentStep = 0;


    switch (status) {

        case "Pending":

            currentStep = 0;

            break;


        case "Preparing":

            currentStep = 2;

            break;


        case "Ready":

            currentStep = 3;

            break;


        case "Completed":

            currentStep = 5;

            break;


        default:

            currentStep = 0;

    }


    /*
       Convert the order type into the
       format expected by the tracker.
    */

    let orderType =
        order.orderType ||
        order.type ||
        "delivery";


    /*
       Create the object that the
       existing Track Order page reads.
    */

    const trackingOrder = {

        orderId: orderId,

        type: orderType,

        currentStep: currentStep

    };


    /*
       Save it using the EXACT key
       used by your existing tracker.
    */

    localStorage.setItem(

        "biteAddaOrder",

        JSON.stringify(
            trackingOrder
        )

    );


    console.log(
        "Customer tracking updated:",
        trackingOrder
    );

}


/* =====================================================
   SAVE ADMIN STATUS
===================================================== */

function saveOrderStatus(
    orderId,
    status
) {

    const statusKey =
        "biteAddaStatus_" +
        orderId;


    localStorage.setItem(
        statusKey,
        status
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    const order =
        getOrder();


    const totalOrdersElement =
        document.getElementById(
            "totalOrders"
        );


    const pendingOrdersElement =
        document.getElementById(
            "pendingOrders"
        );


    const completedOrdersElement =
        document.getElementById(
            "completedOrders"
        );


    const totalSalesElement =
        document.getElementById(
            "totalSales"
        );


    if (!order) {

        totalOrdersElement.textContent =
            "0";

        pendingOrdersElement.textContent =
            "0";

        completedOrdersElement.textContent =
            "0";

        totalSalesElement.textContent =
            "৳0";


        displayLatestOrder(null);

        return;

    }


    const status =
        getOrderStatus(order);


    totalOrdersElement.textContent =
        "1";


    if (status === "Completed") {

        pendingOrdersElement.textContent =
            "0";

        completedOrdersElement.textContent =
            "1";

    }

    else {

        pendingOrdersElement.textContent =
            "1";

        completedOrdersElement.textContent =
            "0";

    }


    totalSalesElement.textContent =
        "৳" +
        (order.total || 0);


    displayLatestOrder(order);

}


/* =====================================================
   DISPLAY LATEST ORDER
===================================================== */

function displayLatestOrder(order) {

    const container =
        document.getElementById(
            "latestOrder"
        );


    if (!order) {

        container.innerHTML = `

            <p class="empty-message">
                No order has been placed yet.
            </p>

        `;

        return;

    }


    const orderId =
        getOrderId(order);


    const status =
        getOrderStatus(order);


    container.innerHTML = `

        <div class="order-card">

            <div class="order-top">

                <div class="order-number">

                    Order #${orderId}

                </div>

                <span class="
                    order-status
                    ${getStatusClass(status)}
                ">

                    ${status}

                </span>

            </div>


            <div class="order-info">

                <div>

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${order.customerName || "N/A"}
                    </strong>

                </div>


                <div>

                    <span>
                        Order Type
                    </span>

                    <strong>
                        ${getOrderType(order)}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ৳${order.total || 0}
                    </strong>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   ORDERS PAGE
===================================================== */

function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    const order =
        getOrder();


    if (!order) {

        container.innerHTML = `

            <div class="dashboard-card">

                <p class="empty-message">
                    No orders have been placed yet.
                </p>

            </div>

        `;

        return;

    }


    displayOrderCard(
        order,
        container
    );

}


/* =====================================================
   DISPLAY ORDER CARD
===================================================== */

function displayOrderCard(
    order,
    container
) {

    const orderId =
        getOrderId(order);


    const status =
        getOrderStatus(order);


    let itemsHTML = "";


    if (
        order.items &&
        Array.isArray(order.items)
    ) {

        order.items.forEach(
            function(item) {

                const quantity =
                    item.quantity || 1;


                const price =
                    (item.price || 0) *
                    quantity;


                itemsHTML += `

                    <div class="order-item">

                        <span>

                            ${item.name || "Item"}
                            × ${quantity}

                        </span>

                        <strong>

                            ৳${price}

                        </strong>

                    </div>

                `;

            }
        );

    }


    if (!itemsHTML) {

        itemsHTML = `

            <p>
                No item details available.
            </p>

        `;

    }


    container.innerHTML = `

        <div class="order-card">


            <div class="order-top">

                <div class="order-number">

                    Order #${orderId}

                </div>


                <span class="
                    order-status
                    ${getStatusClass(status)}
                ">

                    ${status}

                </span>

            </div>



            <div class="order-info">


                <div>

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${order.customerName || "N/A"}
                    </strong>

                </div>


                <div>

                    <span>
                        Order Type
                    </span>

                    <strong>
                        ${getOrderType(order)}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ৳${order.total || 0}
                    </strong>

                </div>


            </div>



            <div class="order-items">

                <h4>
                    Ordered Items
                </h4>

                ${itemsHTML}

            </div>



            <div class="order-total">

                Total:
                ৳${order.total || 0}

            </div>



            <div class="status-control">

                <label>
                    Update Status:
                </label>


                <select
                    onchange="
                        changeOrderStatus(
                            '${orderId}',
                            this.value
                        )
                    "
                >

                    <option
                        value="Pending"
                        ${status === "Pending"
                            ? "selected"
                            : ""}
                    >
                        Pending
                    </option>


                    <option
                        value="Preparing"
                        ${status === "Preparing"
                            ? "selected"
                            : ""}
                    >
                        Preparing
                    </option>


                    <option
                        value="Ready"
                        ${status === "Ready"
                            ? "selected"
                            : ""}
                    >
                        Ready
                    </option>


                    <option
                        value="Completed"
                        ${status === "Completed"
                            ? "selected"
                            : ""}
                    >
                        Completed
                    </option>

                </select>


            </div>


        </div>

    `;

}


/* =====================================================
   ⭐ CHANGE ORDER STATUS
===================================================== */

function changeOrderStatus(
    orderId,
    status
) {

    /*
       Get the original order.
    */

    const order =
        getOrder();


    /*
       Save admin's status.
    */

    saveOrderStatus(
        orderId,
        status
    );


    /*
       ⭐ IMPORTANT:
       Send the new status to the
       customer's Track Order system.
    */

    updateCustomerTracking(
        order,
        status
    );


    /*
       Refresh admin screen.
    */

    loadDashboard();

    loadOrders();

}


/* =====================================================
   STATUS CSS CLASS
===================================================== */

function getStatusClass(status) {

    switch (status) {

        case "Preparing":

            return "status-preparing";


        case "Ready":

            return "status-ready";


        case "Completed":

            return "status-completed";


        default:

            return "status-pending";

    }

}


/* =====================================================
   MENU
===================================================== */

async function loadMenu() {

    const container =
        document.getElementById(
            "menuContainer"
        );


    if (!container) return;


    try {

        const response =
            await fetch(
                "data/menu.json"
            );


        if (!response.ok) {

            throw new Error(
                "Menu JSON could not be loaded."
            );

        }


        const menu =
            await response.json();


        displayMenu(
            menu,
            container
        );

    }

    catch (error) {

        console.log(
            "MENU ERROR:",
            error
        );


        container.innerHTML = `

            <div class="dashboard-card">

                <p class="empty-message">

                    Unable to load menu.

                </p>

            </div>

        `;

    }

}


/* =====================================================
   DISPLAY MENU
===================================================== */

function displayMenu(
    menu,
    container
) {

    container.innerHTML = "";


    /*
       Supports both:

       [
           { name, price, category }
       ]

       and

       {
           burgers: [...]
       }
    */

    let menuItems = [];


    if (Array.isArray(menu)) {

        menuItems = menu;

    }

    else {

        Object.keys(menu).forEach(
            function(category) {

                if (
                    Array.isArray(
                        menu[category]
                    )
                ) {

                    menu[category].forEach(
                        function(item) {

                            menuItems.push({

                                ...item,

                                category:
                                    item.category ||
                                    category

                            });

                        }
                    );

                }

            }
        );

    }


    menuItems.forEach(
        function(item) {

            container.innerHTML += `

                <div class="menu-admin-card">

                    <h3>
                        ${item.name || "Menu Item"}
                    </h3>


                    <p>
                        ${item.category || ""}
                    </p>


                    <p>
                        ${item.description || ""}
                    </p>


                    <div class="menu-admin-price">

                        ৳${item.price || 0}

                    </div>

                </div>

            `;

        }
    );

}


/* =====================================================
   SHOW SECTION
===================================================== */

function showSection(
    sectionName
) {

    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    sections.forEach(
        function(section) {

            section.classList.add(
                "hidden-section"
            );

        }
    );


    const selectedSection =
        document.getElementById(
            sectionName
        );


    if (selectedSection) {

        selectedSection.classList.remove(
            "hidden-section"
        );

    }


    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    buttons.forEach(
        function(button) {

            button.classList.remove(
                "active"
            );

        }
    );


    /*
       Highlight correct button.
    */

    buttons.forEach(
        function(button) {

            const text =
                button.textContent
                    .toLowerCase();


            if (
                text.includes(
                    sectionName
                )
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    const pageSubtitle =
        document.getElementById(
            "pageSubtitle"
        );


    if (sectionName === "dashboard") {

        pageTitle.textContent =
            "Dashboard";

        pageSubtitle.textContent =
            "Welcome to your restaurant dashboard.";

        loadDashboard();

    }


    else if (sectionName === "orders") {

        pageTitle.textContent =
            "Orders";

        pageSubtitle.textContent =
            "View and manage customer orders.";

        loadOrders();

    }


    else if (sectionName === "menu") {

        pageTitle.textContent =
            "Menu";

        pageSubtitle.textContent =
            "View your current restaurant menu.";

        loadMenu();

    }


    else if (sectionName === "restaurant") {

        pageTitle.textContent =
            "Restaurant";

        pageSubtitle.textContent =
            "Restaurant information and settings.";

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "biteAddaAdminLoggedIn"
    );


    window.location.href =
        "admin-login.html";

}


/* =====================================================
   REFRESH EVERYTHING
===================================================== */

function loadAll() {

    loadDashboard();

    loadOrders();

    loadMenu();

}


/* =====================================================
   START ADMIN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

        loadOrders();

    }
);

