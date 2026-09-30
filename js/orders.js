/* =====================================================
   BITE ADDA
   ORDER HISTORY
===================================================== */


/* =====================================================
   SAVE ORDER TO USER HISTORY
===================================================== */

function saveOrderToUserHistory(order) {

    const currentUser =
        JSON.parse(
            localStorage.getItem("biteAddaCurrentUser")
        );


    /* =================================================
       USER IS LOGGED IN
    ================================================= */

    if (currentUser) {

        if (!currentUser.orders) {

            currentUser.orders = [];

        }


        currentUser.orders.push(order);


        localStorage.setItem(
            "biteAddaCurrentUser",
            JSON.stringify(currentUser)
        );


        /* Also update registered users */

        const users =
            JSON.parse(
                localStorage.getItem("biteAddaUsers")
            ) || [];


        const userIndex =
            users.findIndex(function (user) {

                return user.email === currentUser.email;

            });


        if (userIndex !== -1) {

            users[userIndex].orders =
                currentUser.orders;


            localStorage.setItem(
                "biteAddaUsers",
                JSON.stringify(users)
            );

        }


        return;

    }


    /* =================================================
       GUEST USER
    ================================================= */

    const guestOrders =
        JSON.parse(
            localStorage.getItem("biteAddaGuestOrders")
        ) || [];


    guestOrders.push(order);


    localStorage.setItem(
        "biteAddaGuestOrders",
        JSON.stringify(guestOrders)
    );

}