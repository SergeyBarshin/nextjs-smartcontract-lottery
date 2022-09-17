import React from 'react'
import { ConnectButton } from '@web3uikit/web3'
import { Typography } from '@web3uikit/core'


const Header = () => {
    return (
        <header>
            <nav className="bg-white border-b-2 border-gray-100 px-1 py-4">
                <div className="flex flex-wrap justify-between items-center mx-auto ">

                    <Typography
                        variant="h3"
                    >
                        Lottery.io
                    </Typography>


                    <div className="flex items-center ">
                        <ConnectButton moralisAuth={false} />
                    </div>

                </div>
            </nav>
        </header >
    )
}

export default Header