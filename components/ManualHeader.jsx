import { React, useEffect } from 'react'
import { useMoralis } from 'react-moralis'

const ManualHeader = () => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== 'undefined') {
            if (window.localStorage.getItem('connected')) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`changent to ${account}`)
            if (account == null) {
                window.localStorage.removeItem('connected')
                deactivateWeb3()
                console.log('Null account');
            }
        })

    }, [])

    return (
        <header>
            <nav className="bg-white border-gray-900 px-1 py-4">
                <div className="flex flex-wrap justify-between items-center mx-auto px-8">

                    <span className="self-center text-xl font-bold whitespace-nowrap ">Raffle.io</span>

                    <div className="flex items-center lg:order-2">
                        {account
                            ? (<div className='bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                Connected to {account.slice(0, 6)}...</div>)
                            : (<button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={async () => {
                                    await enableWeb3()
                                    if (typeof window !== 'undefined') {
                                        window.localStorage.setItem('connected', 'injected')
                                    }
                                }}
                                disabled={isWeb3EnableLoading}>
                                Connect
                            </button>)}


                    </div>

                </div>
            </nav>
        </header >
    )
}

export default ManualHeader