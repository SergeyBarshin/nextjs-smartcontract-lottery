import { React, useEffect, useState } from 'react'
import { useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from '../constants/index'
import { useMoralis } from 'react-moralis'
import { Button, Typography } from '@web3uikit/core'
import { ethers } from 'ethers'
import { useNotification } from '@web3uikit/core'
import { Bell } from '@web3uikit/icons'


const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState('0')
    const [numPlayers, setNumPlayers] = useState('0')
    const [recentWinner, setRecentWinner] = useState('0')

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee',
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getNumberOfPlayers',
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getRecentWinner',
        params: {},
    })

    const updateUi = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner())
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {

            updateUi()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    const handleNewNotification = () => {
        dispatch({
            type: 'info',
            message: 'Transaction Complete!',
            title: 'Transaction Notification',
            position: 'topR',
            icon: (<Bell fontSize='50px' />),
        })
    }

    //#f2f6ff
    return (
        <div className="flex justify-center pt-40">
            <div className="block p-6 rounded-lg shadow-md  max-w-lg" style={{ background: '#f2f6ff' }}>
                <div className='py-1'>
                    <Typography variant="h2" >Lottery</Typography>
                </div>
                {/*<p className="text-gray-700 text-base mb-4">players: {numPlayers}</p>
                <p className="text-gray-700 text-base mb-4">recentWinner: {recentWinner}</p>*/}

                <Typography variant="body18" >players: {numPlayers}</Typography>
                <br />
                <Typography variant="body16" >recentWinner: {recentWinner}</Typography>



                {raffleAddress ? (
                    <div className='pt-4 flex flex-wrap justify-between items-center mx-auto'>

                        <Typography variant="body18"  >Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH</Typography>
                        {/* <h6 className="text-gray-900 leading-tight font-medium mb-2">Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH</h6>*/}
                        <Button onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error)
                            })
                        }} theme="outline" type="button" size='large' text="Enter Raffle" disabled={isLoading || isFetching} />

                    </div>
                ) : (
                    <div>No Raffle Address Dereched</div>
                )}


            </div>
        </div >
    )
}

export default LotteryEntrance