"use client";

import React, {useContext} from 'react';
import {ContainerData, ContainerState} from "@/types/ContainerData";
import GlowingCard from "@/components/GlowingCard";
import {ContainerViewContext} from "@/context/ContainerView";

const Container = (props: { data: ContainerData, removeContainer: (id: string) => void }) => {

    const [data, setData] = React.useState<ContainerData>(props.data);

    const getStateColor = (state: ContainerState) => {
        switch (state) {
            case 'running':
                return '#00FF00';
            case 'exited':
                return '#FF0000';
            case 'paused':
                return '#f5e103';
            case 'restarting':
                return '#ff00c3';
            case 'created':
                return '#00d0b8';
            default:
                return '#777777';
        }
    }

    const formatImage = (image: string) => {
        if (image.startsWith('sha256:'))
            return image.substring(7, 32) + '...';
        if (image.includes(':'))
            return <>{image.split(':')[0]}<span style={{color: '#a5a5e7'}}>{':' + image.split(':')[1]}</span></>;
        return image;
    }

    const [deleteConfirm, setDeleteConfirm] = React.useState(false);

    const updateContainer = () => {
        fetch('/api/docker/container/' + data.id).then(res => res.json()).then(newData => {
            console.log(newData);
            setData(newData);
        });
    }

    const deleteContainer = () => {
        if (!data.permissions.includes('delete'))
            return;
        if (deleteConfirm) {
            fetch('/api/docker/container/' + data.id + '/delete', {method: 'POST'}).then(() => props.removeContainer(data.id));
        } else
            setDeleteConfirm(true)
    }

    const startContainer = () => {
        if (!data.permissions.includes('start'))
            return;
        fetch('/api/docker/container/' + data.id + '/start', {method: 'POST'}).then(updateContainer);
    }

    const stopContainer = () => {
        if (!data.permissions.includes('start'))
            return;
        fetch('/api/docker/container/' + data.id + '/stop', {method: 'POST'}).then(updateContainer);
    }

    const restartContainer = () => {
        if (!data.permissions.includes('start'))
            return;
        fetch('/api/docker/container/' + data.id + '/restart', {method: 'POST'}).then(updateContainer);
    }

    const viewContext = useContext(ContainerViewContext);

    return (
        <GlowingCard border={getStateColor(data.state)} borderRadius={25}>
            <div className='flex flex-col items-center w-72 p-1 text-white'>
                <div className='flex p-1 w-full items-center'>
                    <img className='w-14 h-14 bg-black rounded-2xl mr-2' alt='' src={'/api/imageicon?image=' + encodeURIComponent(data.image)} onClick={updateContainer}/>
                    <div className='flex flex-col flex-1 leading-[1rem]'>
                        <span className='text-md mb-1 overflow-ellipsis'>{data.name?.substring(1)}</span>
                        <span className='text-[0.8rem] text-zinc-400 h-8 break-all overflow-ellipsis overflow-hidden w-18'>{formatImage(data.image)}</span>
                    </div>
                </div>
                <span className='w-full text-zinc-400 text-[0.8rem] py-0.5 border-y-[1px] border-zinc-700 mt-1 text-center'>{data.status}</span>
                <span className='w-full text-zinc-400 text-[0.8rem] pb-0.5 border-b-[1px] border-zinc-700 text-center'>Running on <span
                    className='font-bold'>{data.server}</span></span>

                <div className='flex justify-evenly p-2 pb-1 w-full'>
                    {data.state == 'running' ? <>
                        <img src='/img/stop.svg' className={'h-5 w-5 ' + (data.permissions.includes('start') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={stopContainer}/>
                        <img src='/img/restart.svg' className={'h-5 w-5 ' + (data.permissions.includes('start') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={restartContainer}/>
                    </> : <>
                        <img src='/img/start.svg' className={'h-5 w-5 ' + (data.permissions.includes('start') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={startContainer}/>
                        <img src={deleteConfirm ? '/img/delete_confirm.svg' : '/img/delete.svg'} onClick={deleteContainer} onMouseLeave={() => setDeleteConfirm(false)}
                             className={'h-5 w-5 ' + (data.permissions.includes('delete') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')}/>
                    </>}
                    <img src='/img/terminal.svg' className={'h-5 w-5 ' + (data.permissions.includes('logs') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('logs') && viewContext.setView?.("logs", data)}/>
                    <img src='/img/settings.svg' className={'h-5 w-5 ' + (data.permissions.includes('info') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('info') && viewContext.setView?.("info", data)}/>
                    <img src='/img/access.svg' className={'h-5 w-5 ' + (data.permissions.includes('access') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('access') && viewContext.setView?.("access", data)}/>
                    <img src='/img/env.svg' className={'h-5 w-5 ' + (data.permissions.includes('envs') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('envs') && viewContext.setView?.("env", data)}/>
                    <img src='/img/volumes.svg' className={'h-5 w-5 ' + (data.permissions.includes('volumes') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('volumes') && viewContext.setView?.("volumes", data)}/>
                    <img src='/img/networks.svg' className={'h-5 w-5 ' + (data.permissions.includes('networks') ? 'hover:brightness-125 cursor-pointer' : 'brightness-50')} onClick={() => data.permissions.includes('networks') && viewContext.setView?.("networks", data)}/>
                </div>
            </div>
        </GlowingCard>
    );
};

export default Container;