/* =====================================================
   BITE ADDA
   MAIN JAVASCRIPT
   MENU + CART + CHECKOUT + DINE-IN
===================================================== */


/* =====================================================
   HEADER / FOOTER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* Load header only if the page has #header */
    const headerContainer = document.getElementById("header");

    if (headerContainer) {

        fetch("header.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                headerContainer.innerHTML = data;
                setupHeader();
                updateCartCount();
            })
            .catch(function (error) {
                console.log("HEADER ERROR:", error);
            });

    } else {

        setupHeader();
        updateCartCount();

    }


    /* Load footer only if the page has #footer */
    const footerContainer = document.getElementById("footer");

    if (footerContainer) {

        fetch("footer.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                footerContainer.innerHTML = data;
            })
            .catch(function (error) {
                console.log("FOOTER ERROR:", error);
            });

    }


    /* MENU */
    if (document.getElementById("menuGrid")) {

        loadMenuData();
        setupCategoryFilter();

    }


    /* CART */
    if (document.getElementById("cartItems")) {

        displayCart();

    }


    /* CHECKOUT */
    if (document.getElementById("checkoutItems")) {

        displayCheckout();
        setupOrderTypes();
        setupPayment();
        loadSeats();
        setupCheckoutForm();

    }

});


/* =====================================================
   HEADER
===================================================== */

function setupHeader() {

    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (!navToggle || !mainNav) return;


    navToggle.addEventListener("click", function () {

        mainNav.classList.toggle("open");

    });

}


/* =====================================================
   CART DATA
===================================================== */

let menuItems = [];

let cart =
    JSON.parse(localStorage.getItem("biteAddaCart")) || [];


/* =====================================================
   LOAD MENU DATA
===================================================== */

async function loadMenuData() {

    try {

        const response =
            await fetch("data/menu.json");


        if (!response.ok) {

            throw new Error(
                "Menu JSON could not be loaded"
            );

        }


        menuItems =
            await response.json();


    } catch (error) {

        console.log(
            "Using backup menu data."
        );


        menuItems = [

            {
                id: 1,
                name: "Adda Zinger Burger",
                category: "Burgers",
                price: 180,
                description:
                    "Crispy zinger chicken with fresh lettuce and creamy house sauce.",
                image: "",
                badge: "Bestseller",
                extras: [
            {
                name: "Extra Cheese",
                price: 30
            },
            {
                name: "Extra Chicken",
                price: 80
            },
            {
                name: "Jalapeño",
                price: 20
            }
                ]
            },

            {
                id: 2,
                name: "Cheesy Beef Burger",
                category: "Burgers",
                price: 220,
                description:
                    "Juicy beef patty with melted cheese, fresh vegetables and special sauce.",
                image: "",
                badge: ""
            },

            {
                id: 3,
                name: "Fiery Fried Chicken (2pc)",
                category: "Fried Chicken",
                price: 210,
                description:
                    "Two crispy chicken pieces coated with spicy signature seasoning.",
                image: "",
                badge: "Hot"
            },

            {
                id: 4,
                name: "Classic Fried Chicken (2pc)",
                category: "Fried Chicken",
                price: 190,
                description:
                    "Two golden crispy chicken pieces with a classic crunchy coating.",
                image: "",
                badge: ""
            },

            {
                id: 5,
                name: "Chicken Shawarma Roll",
                category: "Rolls & Wraps",
                price: 150,
                description:
                    "Tender chicken, fresh vegetables and creamy garlic sauce in soft flatbread.",
                image: "",
                badge: ""
            },

            {
                id: 6,
                name: "Beef Kathi Roll",
                category: "Rolls & Wraps",
                price: 170,
                description:
                    "Juicy seasoned beef with onions, vegetables and special sauce.",
                image: "",
                badge: ""
            },

            {
                id: 7,
                name: "Loaded Cheesy Fries",
                category: "Sides",
                price: 140,
                description:
                    "Crispy golden fries loaded with creamy cheese sauce and toppings.",
                image: "",
                badge: ""
            },

            {
                id: 8,
                name: "Onion Rings",
                category: "Sides",
                price: 110,
                description:
                    "Crunchy golden onion rings served fresh and perfectly seasoned.",
                image: "",
                badge: ""
            },

            {
                id: 9,
                name: "Adda Family Combo",
                category: "Combos",
                price: 520,
                description:
                    "A satisfying family combo packed with delicious favourites for sharing.",
                image: "",
                badge: "15% OFF"
            },

            {
                id: 10,
                name: "Solo Zinger Combo",
                category: "Combos",
                price: 280,
                description:
                    "A crispy zinger burger served with fries and a refreshing drink.",
                image: "",
                badge: ""
            },

            {
                id: 11,
                name: "Cold Coffee Shake",
                category: "Beverages",
                price: 120,
                description:
                    "Smooth and creamy chilled coffee shake with rich coffee flavour.",
                image: "",
                badge: ""
            },

            {
                id: 12,
                name: "Lemon Mint Cooler",
                category: "Beverages",
                price: 90,
                description:
                    "A refreshing blend of lemon, mint and ice.",
                image: "",
                badge: ""
            },

            {
                id: 13,
                name: "Chocolate Shake",
                category: "Beverages",
                price: 150,
                description: "Creamy chocolate shake topped with chocolate drizzle.",
                image: "",
                badge: "Sweet",
                extras: [
                {
                    name: "Whipped Cream",
                    price: 20
                }
                ]
            },
            
            {
            id: 14,
            name: "Coca Cola",
            category: "Beverages",
            price: 80,
            description: "Refreshing, fizzy soft drink.",
            image: "images/coke.jpeg",
            badge: ""
        
    }


        ];

    }


    displayMenu("All");

}


/* =====================================================
   DISPLAY MENU
===================================================== */

function displayMenu(category) {

    const menuGrid =
        document.getElementById("menuGrid");


    if (!menuGrid) return;


    let filteredItems;


    if (category === "All") {

        filteredItems = menuItems;

    } else {

        filteredItems =
            menuItems.filter(function (item) {

                return item.category === category;

            });

    }


    menuGrid.innerHTML = "";


    filteredItems.forEach(function (item) {


        const cartItem =
            cart.find(function (cartItem) {

                return cartItem.id === item.id;

            });


        const card =
            document.createElement("article");


        card.className =
            "food-card";


        /* ==============================
           IMAGE
        =============================== */

        let imageHTML;


        if (item.image) {

            imageHTML = `
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.style.display='none';"
                >
            `;

        } else {

            imageHTML = `
                <div class="food-placeholder">
                    🍔
                </div>
            `;

        }


        /* ==============================
           CARD
        =============================== */

        card.innerHTML = `

            <div class="food-image">

                ${
                    item.badge
                    ?
                    `
                    <span class="food-badge">
                        ${item.badge}
                    </span>
                    `
                    :
                    ""
                }

                ${imageHTML}

            </div>


            <div class="food-info">

                <span class="food-category">
                    ${item.category}
                </span>


                <h3>
                    ${item.name}
                </h3>


                <p class="food-description">
                    ${item.description}
                </p>


                <div class="food-bottom">

                    <span class="food-price">
                        ৳${item.price}
                    </span>


                    <button
                        class="add-button
                        ${cartItem ? "added" : ""}"
                        data-id="${item.id}"
                        ${cartItem ? "disabled" : ""}>

                        ${
                            cartItem
                            ?
                            "✓"
                            :
                            "ADD TO CART"
                        }

                    </button>

                </div>

            </div>

        `;


        menuGrid.appendChild(card);

    });


    /* ==============================
       ADD BUTTONS
    =============================== */

    document
        .querySelectorAll(".add-button")
        .forEach(function (button) {


            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    addToCart(id);

                }
            );

        });

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    const item =
        menuItems.find(function (item) {

            return item.id === id;

        });


    if (!item) return;


    const existingItem =
        cart.find(function (cartItem) {

            return cartItem.id === id;

        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: item.id,

            name: item.name,

            price: item.price,

            image: item.image,

            quantity: 1

        });

    }


    saveCart();


    const activeButton =
        document.querySelector(
            `.add-button[data-id="${id}"]`
        );


    if (activeButton) {

        activeButton.innerHTML = "✓";
        activeButton.disabled = true;
        activeButton.classList.add("added");

    }

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "biteAddaCart",
        JSON.stringify(cart)
    );


    updateCartCount();

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) return;


    const totalQuantity =
        cart.reduce(
            function (total, item) {

                return total + item.quantity;

            },
            0
        );


    cartCount.textContent =
        totalQuantity;

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function setupCategoryFilter() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                buttons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                displayMenu(
                    this.dataset.category
                );

            }
        );

    });

}


/* =====================================================
   CART PAGE
===================================================== */

function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!cartItems) return;


    cartItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        emptyCart.classList.remove(
            "hidden"
        );


        subtotalElement.textContent =
            "৳0";


        totalElement.textContent =
            "৳0";


        return;

    }


    emptyCart.classList.add(
        "hidden"
    );


    let subtotal = 0;


    cart.forEach(function (item) {


        const itemTotal =
            item.price * item.quantity;


        subtotal += itemTotal;


        const cartItem =
            document.createElement(
                "div"
            );


        cartItem.className =
            "cart-item";


        let imageHTML;


        if (item.image) {

            imageHTML = `
                <img
                    src="${item.image}"
                    alt="${item.name}">
            `;

        } else {

            imageHTML = `
                <div class="cart-placeholder">
                    🍔
                </div>
            `;

        }


        cartItem.innerHTML = `

            ${imageHTML}


            <div>

                <h3>
                    ${item.name}
                </h3>


                <small>
                    ৳${item.price} each
                </small>


                <div class="cart-quantity">

                    <button
                        class="quantity-minus"
                        data-id="${item.id}">
                        −
                    </button>


                    <strong>
                        ${item.quantity}
                    </strong>


                    <button
                        class="quantity-plus"
                        data-id="${item.id}">
                        +
                    </button>

                </div>


                <button
                    class="remove-item"
                    data-id="${item.id}">

                    Remove

                </button>

            </div>


            <div>

                <span class="cart-item-price">
                    ৳${itemTotal}
                </span>

            </div>

        `;


        cartItems.appendChild(
            cartItem
        );

    });


    subtotalElement.textContent =
        `৳${subtotal}`;


    totalElement.textContent =
        `৳${subtotal}`;


    setupCartButtons();

}


/* =====================================================
   CART BUTTONS
===================================================== */

function setupCartButtons() {


    document
        .querySelectorAll(".quantity-plus")
        .forEach(function (button) {


            button.addEventListener(
                "click",
                function () {

                    changeQuantity(
                        Number(this.dataset.id),
                        1
                    );

                }
            );

        });


    document
        .querySelectorAll(".quantity-minus")
        .forEach(function (button) {


            button.addEventListener(
                "click",
                function () {

                    changeQuantity(
                        Number(this.dataset.id),
                        -1
                    );

                }
            );

        });


    document
        .querySelectorAll(".remove-item")
        .forEach(function (button) {


            button.addEventListener(
                "click",
                function () {

                    removeFromCart(
                        Number(this.dataset.id)
                    );

                }
            );

        });

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(id, amount) {

    const item =
        cart.find(function (item) {

            return item.id === id;

        });


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(function (item) {

                return item.id !== id;

            });

    }


    saveCart();

    displayCart();

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(function (item) {

            return item.id !== id;

        });


    saveCart();

    displayCart();

}


/* =====================================================
   CHECKOUT
===================================================== */

function displayCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    const deliveryFeeElement =
        document.getElementById(
            "deliveryFee"
        );


    const grandTotalElement =
        document.getElementById(
            "grandTotal"
        );


    if (!checkoutItems) return;


    checkoutItems.innerHTML = "";


    let subtotal = 0;


    /* EMPTY CART */

    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <p>
                Your cart is empty.
            </p>

            <a
                href="menu.html"
                class="btn btn-red">

                Browse Menu

            </a>

        `;


        subtotalElement.textContent =
            "৳0";


        deliveryFeeElement.textContent =
            "৳0";


        grandTotalElement.textContent =
            "৳0";


        return;

    }


    cart.forEach(function (item) {


        const itemTotal =
            item.price * item.quantity;


        subtotal += itemTotal;


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "summary-line";


        row.innerHTML = `

            <span>
                ${item.name}
                × ${item.quantity}
            </span>

            <strong>
                ৳${itemTotal}
            </strong>

        `;


        checkoutItems.appendChild(
            row
        );

    });


    subtotalElement.textContent =
        `৳${subtotal}`;


    updateCheckoutTotal();

}


/* =====================================================
   ORDER TYPE
===================================================== */

let selectedOrderType =
    "delivery";


function setupOrderTypes() {

    const buttons =
        document.querySelectorAll(
            ".order-type"
        );


    if (!buttons.length) return;


    buttons.forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                buttons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                selectedOrderType =
                    this.dataset.type;


                updateOrderFields();

                updateCheckoutTotal();

            }
        );

    });


    updateOrderFields();

}


/* =====================================================
   ORDER TYPE FIELDS
===================================================== */

function updateOrderFields() {

    const deliveryFields =
        document.getElementById(
            "deliveryFields"
        );


    const takeawayFields =
        document.getElementById(
            "takeawayFields"
        );


    const dineinFields =
        document.getElementById(
            "dineinFields"
        );


    if (
        !deliveryFields ||
        !takeawayFields ||
        !dineinFields
    ) return;


    deliveryFields.classList.add(
        "hidden"
    );


    takeawayFields.classList.add(
        "hidden"
    );


    dineinFields.classList.add(
        "hidden"
    );


    if (
        selectedOrderType ===
        "delivery"
    ) {

        deliveryFields.classList.remove(
            "hidden"
        );

    }


    if (
        selectedOrderType ===
        "takeaway"
    ) {

        takeawayFields.classList.remove(
            "hidden"
        );

    }


    if (
        selectedOrderType ===
        "dinein"
    ) {

        dineinFields.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   DELIVERY FEE
===================================================== */

function getDeliveryFee() {

    if (
        selectedOrderType ===
        "delivery"
    ) {

        return 60;

    }


    return 0;

}


/* =====================================================
   UPDATE CHECKOUT TOTAL
===================================================== */

function updateCheckoutTotal() {

    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    const deliveryFeeElement =
        document.getElementById(
            "deliveryFee"
        );


    const grandTotalElement =
        document.getElementById(
            "grandTotal"
        );


    if (
        !subtotalElement ||
        !deliveryFeeElement ||
        !grandTotalElement
    ) return;


    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal +=
            item.price * item.quantity;

    });


    const deliveryFee =
        getDeliveryFee();


    const total =
        subtotal + deliveryFee;


    subtotalElement.textContent =
        `৳${subtotal}`;


    deliveryFeeElement.textContent =
        `৳${deliveryFee}`;


    grandTotalElement.textContent =
        `৳${total}`;

}


/* =====================================================
   LOAD SEATS
===================================================== */

async function loadSeats() {

    const tableGrid =
        document.getElementById(
            "tableGrid"
        );


    if (!tableGrid) return;


    try {


        const response =
            await fetch(
                "data/seats.json"
            );


        if (!response.ok) {

            throw new Error(
                "Seats JSON could not be loaded"
            );

        }


        const seats =
            await response.json();


        displaySeats(seats);


    } catch (error) {

        console.log(
            "SEATS ERROR:",
            error
        );


        tableGrid.innerHTML = `

            <p>
                Unable to load table availability.
            </p>

        `;

    }

}


/* =====================================================
   DISPLAY SEATS
===================================================== */

function displaySeats(seats) {

    const tableGrid =
        document.getElementById(
            "tableGrid"
        );


    if (!tableGrid) return;


    tableGrid.innerHTML = "";


    seats.forEach(function (seat) {


        const table =
            document.createElement(
                "div"
            );


        table.className =
            "table-option " +
            seat.status;


        table.innerHTML = `

            <strong>
                ${seat.table}
            </strong>

            <span class="table-status">

                ${
                    seat.status === "available"
                    ?
                    "Available"
                    :
                    "Occupied"
                }

            </span>

            <small>
                ${seat.capacity} seats
            </small>

        `;


        if (
            seat.status ===
            "available"
        ) {


            table.addEventListener(
                "click",
                function () {


                    document
                        .querySelectorAll(
                            ".table-option"
                        )
                        .forEach(
                            function (item) {

                                item.classList
                                    .remove(
                                        "selected"
                                    );

                            }
                        );


                    table.classList.add(
                        "selected"
                    );


                    const selectedTable =
                        document.getElementById(
                            "selectedTable"
                        );


                    selectedTable.value =
                        seat.table;

                }
            );

        }


        tableGrid.appendChild(
            table
        );

    });

}


/* =====================================================
   PAYMENT
===================================================== */

function setupPayment() {

    const paymentInputs =
        document.querySelectorAll(
            'input[name="payment"]'
        );


    const bkashBox =
        document.getElementById(
            "bkashBox"
        );


    if (!paymentInputs.length) return;


    paymentInputs.forEach(
        function (input) {


            input.addEventListener(
                "change",
                function () {


                    if (
                        this.value ===
                        "bkash"
                    ) {

                        bkashBox.classList
                            .remove(
                                "hidden"
                            );

                    } else {

                        bkashBox.classList
                            .add(
                                "hidden"
                            );

                    }

                }
            );

        }
    );

}


/* =====================================================
   CHECKOUT FORM
===================================================== */

function setupCheckoutForm() {

    const form =
        document.getElementById(
            "checkoutForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            if (
                selectedOrderType ===
                "dinein"
            ) {


                const selectedTable =
                    document.getElementById(
                        "selectedTable"
                    );


                if (
                    !selectedTable ||
                    !selectedTable.value
                ) {

                    alert(
                        "Please select an available table."
                    );

                    return;

                }

            }


            const name =
                document.getElementById(
                    "customerName"
                ).value;


            const orderNumber =
             "BA" +
            Math.floor(
                100000 +
                 Math.random() * 900000
            );


const newOrder = {

    orderId: orderNumber,

    customerName: name,

    type: selectedOrderType,

    items: cart,

    total: calculateFinalTotal(),

    currentStep: 0

};


localStorage.setItem(
    "biteAddaOrder",
    JSON.stringify(newOrder)
);
saveOrderToUserHistory(newOrder);


            alert(
                "Order placed successfully! Your order number is " +
                orderNumber
            );


            cart = [];


            saveCart();


            window.location.href =
                "track.html";

        }
    );

}


/* =====================================================
   FINAL TOTAL
===================================================== */

function calculateFinalTotal() {

    let subtotal = 0;


    cart.forEach(function (item) {

        subtotal +=
            item.price * item.quantity;

    });


    return subtotal +
        getDeliveryFee();

}

/* =====================================================
   TRACK ORDER
===================================================== */

function setupTrackOrder() {

    const trackForm = document.getElementById("trackForm");

    if (!trackForm) return;


    trackForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const orderIdInput =
            document.getElementById("orderIdInput");

        const orderId =
            orderIdInput.value.trim().toUpperCase();


        const trackResult =
            document.getElementById("trackResult");

        const trackError =
            document.getElementById("trackError");


        /*
         * Get the order saved during checkout
         */

        const savedOrder =
            JSON.parse(
                localStorage.getItem("biteAddaOrder")
            );


        /*
         * Check whether an order exists
         * and whether the ID matches
         */

        if (
            !savedOrder ||
            savedOrder.orderId !== orderId
        ) {

            trackResult.classList.add("hidden");

            trackError.classList.remove("hidden");

            return;

        }


        /*
         * Order found
         */

        trackError.classList.add("hidden");

        trackResult.classList.remove("hidden");


        document.getElementById("displayOrderId")
            .textContent = savedOrder.orderId;


        const displayType =
            document.getElementById("displayOrderType");


        if (savedOrder.type === "delivery") {

            displayType.textContent = "🛵 Delivery";

        }

        else if (savedOrder.type === "takeaway") {

            displayType.textContent = "🥡 Takeaway";

        }

        else if (savedOrder.type === "dinein") {

            displayType.textContent = "🍽️ Dine-In";

        }


        createTrackingTimeline(
            savedOrder.type,
            savedOrder.currentStep
        );

    });

}


/* =====================================================
   CREATE TRACKING TIMELINE
===================================================== */

function createTrackingTimeline(type, currentStep) {

    const timeline =
        document.getElementById("statusTimeline");


    if (!timeline) return;


    let steps = [];


    /* =========================
       DELIVERY
    ========================= */

    if (type === "delivery") {

        steps = [

            {
                title: "Order Confirmed",
                description:
                    "Your order has been received."
            },

            {
                title: "Order Received",
                description:
                    "Our restaurant has accepted your order."
            },

            {
                title: "Preparing Your Food",
                description:
                    "Our kitchen is preparing your meal."
            },

            {
                title: "Ready for Delivery",
                description:
                    "Your food is packed and ready."
            },

            {
                title: "Out for Delivery",
                description:
                    "Your rider is on the way."
            },

            {
                title: "Delivered",
                description:
                    "Your order has been delivered. Enjoy!"
            }

        ];

    }


    /* =========================
       TAKEAWAY
    ========================= */

    else if (type === "takeaway") {

        steps = [

            {
                title: "Order Confirmed",
                description:
                    "Your order has been received."
            },

            {
                title: "Order Received",
                description:
                    "Our restaurant has accepted your order."
            },

            {
                title: "Preparing Your Food",
                description:
                    "Our kitchen is preparing your meal."
            },

            {
                title: "Ready for Pickup",
                description:
                    "Your order is ready to be collected."
            },

            {
                title: "Picked Up",
                description:
                    "Your order has been picked up. Enjoy!"
            }

        ];

    }


    /* =========================
       DINE-IN
    ========================= */

    else if (type === "dinein") {

        steps = [

            {
                title: "Order Confirmed",
                description:
                    "Your dine-in order has been received."
            },

            {
                title: "Order Received",
                description:
                    "The restaurant has accepted your order."
            },

            {
                title: "Preparing Your Food",
                description:
                    "Our kitchen is preparing your meal."
            },

            {
                title: "Ready to Serve",
                description:
                    "Your food is ready to be served."
            },

            {
                title: "Served",
                description:
                    "Your meal has been served. Enjoy!"
            }

        ];

    }


    timeline.innerHTML = "";


    steps.forEach(function (step, index) {

        const stepElement =
            document.createElement("div");


        let status;


        if (index < currentStep) {

            status = "completed";

        }

        else if (index === currentStep) {

            status = "current";

        }

        else {

            status = "upcoming";

        }


        stepElement.className =
            "timeline-step " + status;


        stepElement.innerHTML = `

            <div class="timeline-dot"></div>

            <div class="timeline-content">

                <h3>
                    ${step.title}
                </h3>

                <p>
                    ${step.description}
                </p>

            </div>

        `;


        timeline.appendChild(stepElement);

    });

}


/* =====================================================
   START TRACK ORDER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTrackOrder();

    }
);

/* =====================================================
   ABOUT IMAGE - SCALE UP ON PAGE LOAD
===================================================== */

.about-image {
    animation: aboutImageScale 1s ease-out forwards;
    transform-origin: center center;
}


@keyframes aboutImageScale {

    0% {
        opacity: 0;
        transform: scale(0.65);
    }

    60% {
        opacity: 1;
        transform: scale(1.08);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }

}