/* =====================================================
   BITE ADDA
   AUTHENTICATION
   REGISTER + LOGIN + NAVIGATION
===================================================== */


/* =====================================================
   GET ALL USERS
===================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("biteAddaUsers")
    ) || [];

}


/* =====================================================
   SAVE ALL USERS
===================================================== */

function saveUsers(users) {

    localStorage.setItem(
        "biteAddaUsers",
        JSON.stringify(users)
    );

}


/* =====================================================
   REGISTER
===================================================== */

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim().toLowerCase();


            const phone =
                document.getElementById(
                    "registerPhone"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* CHECK PASSWORD */

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;

            }


            /* GET USERS */

            const users = getUsers();


            /* CHECK EMAIL */

            const existingUser =
                users.find(function (user) {

                    return user.email === email;

                });


            if (existingUser) {

                message.textContent =
                    "An account with this email already exists.";

                return;

            }


            /* CREATE USER */

            const newUser = {

                id:
                    "USER" + Date.now(),

                name: name,

                email: email,

                phone: phone,

                password: password,

                orders: []

            };


            /* SAVE USER */

            users.push(newUser);

            saveUsers(users);


            message.textContent =
                "Account created successfully!";


            /* GO TO LOGIN */

            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1000);

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim().toLowerCase();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            /* FIND USER */

            const user =
                users.find(function (user) {

                    return (
                        user.email === email &&
                        user.password === password
                    );

                });


            if (!user) {

                message.textContent =
                    "Invalid email or password.";

                return;

            }


            /* SAVE CURRENT USER */

            localStorage.setItem(
                "biteAddaCurrentUser",
                JSON.stringify(user)
            );
            mergeGuestOrders(user);


window.location.href =
    "account.html";


            message.textContent =
                "Login successful!";


            /* GO TO ACCOUNT */

            setTimeout(function () {

                window.location.href =
                    "account.html";

            }, 700);

        }
    );

}


/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(
            "biteAddaCurrentUser"
        )
    );

}
/* =====================================================
   SAVE ORDER TO USER HISTORY
===================================================== */

function saveOrderToUserHistory(order) {

    const currentUser =
        getCurrentUser();


    /* ==========================================
       LOGGED-IN USER
    ========================================== */

    if (currentUser) {

        if (!currentUser.orders) {

            currentUser.orders = [];

        }


        currentUser.orders.push(order);


        /* Save updated current user */

        localStorage.setItem(
            "biteAddaCurrentUser",
            JSON.stringify(currentUser)
        );


        /* Update registered users */

        const users =
            getUsers();


        const userIndex =
            users.findIndex(function (user) {

                return (
                    user.email ===
                    currentUser.email
                );

            });


        if (userIndex !== -1) {

            users[userIndex].orders =
                currentUser.orders;


            saveUsers(users);

        }


        return;

    }


    /* ==========================================
       GUEST USER
    ========================================== */

    const guestOrders =
        JSON.parse(
            localStorage.getItem(
                "biteAddaGuestOrders"
            )
        ) || [];


    guestOrders.push(order);


    localStorage.setItem(
        "biteAddaGuestOrders",
        JSON.stringify(guestOrders)
    );

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
   UPDATE LOGIN BUTTON
===================================================== */

function updateLoginButton() {

    const loginLinks =
        document.querySelectorAll(
            ".login-pill"
        );


    const currentUser =
        getCurrentUser();


    loginLinks.forEach(function (link) {

        if (currentUser) {

            link.textContent =
                "My Account";

            link.href =
                "account.html";

        }

        else {

            link.textContent =
                "Login";

            link.href =
                "login.html";

        }

    });

}


/* =====================================================
   START AUTH
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupRegister();

        setupLogin();

        updateLoginButton();

    }
);

/* =====================================================
   MERGE GUEST ORDERS AFTER LOGIN
===================================================== */

function mergeGuestOrders(currentUser) {

    if (!currentUser) return;


    /* Get guest orders */

    const guestOrders =
        JSON.parse(
            localStorage.getItem(
                "biteAddaGuestOrders"
            )
        ) || [];


    if (guestOrders.length === 0) {

        return;

    }


    /* Make sure user has order history */

    if (!currentUser.orders) {

        currentUser.orders = [];

    }


    /* Find guest orders belonging
       to this user's phone */

    const matchingOrders =
        guestOrders.filter(
            function (order) {

                return (
                    order.phone ===
                    currentUser.phone
                );

            }
        );


    if (matchingOrders.length === 0) {

        return;

    }


    /* Avoid duplicate orders */

    matchingOrders.forEach(
        function (guestOrder) {

            const alreadyExists =
                currentUser.orders.some(
                    function (existingOrder) {

                        return (
                            existingOrder.orderId ===
                            guestOrder.orderId
                        );

                    }
                );


            if (!alreadyExists) {

                currentUser.orders.push(
                    guestOrder
                );

            }

        }
    );


    /* Save updated current user */

    localStorage.setItem(
        "biteAddaCurrentUser",
        JSON.stringify(currentUser)
    );


    /* Update registered user */

    const users =
        JSON.parse(
            localStorage.getItem(
                "biteAddaUsers"
            )
        ) || [];


    const userIndex =
        users.findIndex(
            function (user) {

                return (
                    user.email ===
                    currentUser.email
                );

            }
        );


    if (userIndex !== -1) {

        users[userIndex].orders =
            currentUser.orders;


        localStorage.setItem(
            "biteAddaUsers",
            JSON.stringify(users)
        );

    }


    /* Remove the guest orders
       that were successfully linked */

    const remainingGuestOrders =
        guestOrders.filter(
            function (order) {

                return (
                    order.phone !==
                    currentUser.phone
                );

            }
        );


    localStorage.setItem(
        "biteAddaGuestOrders",
        JSON.stringify(
            remainingGuestOrders
        )
    );

}