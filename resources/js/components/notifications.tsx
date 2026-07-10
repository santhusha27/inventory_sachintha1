import { usePage } from '@inertiajs/react';
import { Bell, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';


interface NotificationItem {

    id: string;

    data: {

        type: string;

        title: string;

        message: string;

    };

    created_at: string;

}



export default function Notifications() {


    const [open, setOpen] = useState(false);



    const {
        notifications = []
    } = usePage<{

        notifications: NotificationItem[];

    }>().props;





    return (

        <div className="relative flex justify-end">


            {/* Bell Icon */}

            <button

                onClick={() => setOpen(!open)}

                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-black hover:bg-orange-400"

            >

                <Bell className="h-6 w-6" />


                {
                    notifications.length > 0 && (

                        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">

                            {notifications.length}

                        </span>

                    )
                }


            </button>





            {/* Dropdown */}

            {

                open && (

                    <div className="absolute right-0 z-50 mt-3 w-96 rounded-xl border border-orange-500 bg-[#111111] p-4 text-white shadow-xl">


                        <div className="mb-4 flex items-center justify-between">


                            <h2 className="text-xl font-bold text-orange-500">

                                Notifications

                            </h2>



                            <span className="rounded bg-orange-500 px-2 py-1 text-xs text-black">

                                {notifications.length}

                            </span>


                        </div>





                        {

                            notifications.length === 0 ?


                            (

                                <p className="py-5 text-center text-gray-400">

                                    No notifications available

                                </p>

                            )



                            :



                            (

                                <div className="max-h-96 space-y-3 overflow-y-auto">


                                    {
                                        notifications.map((notification) => (


                                            <div

                                                key={notification.id}

                                                className="rounded-lg border border-gray-700 bg-[#1b1b1b] p-3"

                                            >


                                                <div className="flex items-start gap-3">


                                                    {


                                                        notification.data.type ===
                                                        'low_stock'

                                                        ?

                                                        (

                                                            <AlertTriangle

                                                                className="mt-1 h-5 w-5 text-red-500"

                                                            />

                                                        )


                                                        :


                                                        (

                                                            <ShoppingCart

                                                                className="mt-1 h-5 w-5 text-green-500"

                                                            />

                                                        )

                                                    }



                                                    <div>


                                                        <h3 className="font-semibold text-orange-400">

                                                            {notification.data.title}

                                                        </h3>



                                                        <p className="mt-1 text-sm text-gray-300">

                                                            {notification.data.message}

                                                        </p>



                                                        <p className="mt-2 text-xs text-gray-500">

                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleString()}

                                                        </p>


                                                    </div>


                                                </div>


                                            </div>


                                        ))
                                    }


                                </div>

                            )

                        }


                    </div>

                )

            }


        </div>

    );

}