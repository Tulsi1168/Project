/* =====================================================
   BITE ADDA
   ORDER HISTORY
===================================================== */


/* =====================================================
   SAVE ORDER TO CURRENT USER
===================================================== */

function saveOrderToUserHistory(order) {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "biteAddaCurrentUser"
            )
        );


    /* USER NOT LOGGED IN */

    if (!currentUser) {

        return;

    }


    /* GET ALL USERS */

    const users =
        JSON.parse(
            localStorage.getItem(
                "biteAddaUsers"
            )
        ) || [];


    /* FIND CURRENT USER */

    const userIndex =
        users.findIndex(function (user) {

            return user.id === currentUser.id;

        });


    /* USER NOT FOUND */

    if (userIndex === -1) {

        return;

    }


    /* MAKE SURE ORDERS ARRAY EXISTS */

    if (!users[userIndex].orders) {

        users[userIndex].orders = [];

    }


    /* ADD ORDER */

    users[userIndex].orders.push(order);


    /* SAVE ALL USERS */

    localStorage.setItem(
        "biteAddaUsers",
        JSON.stringify(users)
    );


    /* UPDATE CURRENT USER */

    localStorage.setItem(
        "biteAddaCurrentUser",
        JSON.stringify(
            users[userIndex]
        )
    );

}