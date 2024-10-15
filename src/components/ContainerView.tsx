"use client";

import React from 'react';
import Containers from "@/components/Containers";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {ContainerViewContext} from "@/context/ContainerView";
import {ContainerData} from "@/types/ContainerData";
import ContainerInfo from "@/components/panels/ContainerInfo";

const ContainerView = () => {

    const [panel, setPanel] = React.useState<string | undefined>();
    const [container, setContainer] = React.useState<ContainerData | undefined>();
    const [defaultSize, setDefaultSize] = React.useState<number>(100);

    const setView = (view: string, container: ContainerData) => {
        setPanel(view);
        setContainer(container);
        setDefaultSize(70);
    }

    const closeView = () => {
        setPanel(undefined);
        setContainer(undefined);
        setDefaultSize(100);
    }

    const formatImage = (image: string) => {
        if (image.startsWith('sha256:'))
            return image.substring(7, 32) + '...';
        if (image.includes(':'))
            return <>{image.split(':')[0]}<span style={{color: '#a5a5e7'}}>{':' + image.split(':')[1]}</span></>;
        return image;
    }

    return (
        <ContainerViewContext.Provider value={{setView, closeView}}>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={defaultSize} minSize={65}>
                    <div className='w-full h-screen flex flex-col justify-center overflow-y-auto'>
                        <Containers/>
                    </div>
                </ResizablePanel>
                {panel && container && <>
                    <ResizableHandle/>
                    <ResizablePanel minSize={20}>
                        <div className='w-full h-full flex flex-col bg-zinc-900 relative p-6'>
                            <img className='absolute top-3 right-4 w-6 h-6 hover:brightness-125 cursor-pointer' src='/img/close.svg' onClick={closeView}/>
                            <div className='flex w-full items-center mb-6 -mt-2'>
                                <img className='w-20 h-20 rounded-2xl mr-4' alt='' src={'/api/imageicon?image=' + encodeURIComponent(container.image)}/>
                                <div className='flex flex-col flex-1 leading-[1rem] max-w-full'>
                                    <span className='text-xl font-bold mb-1 overflow-ellipsis text-white'>{container.name?.substring(1)}</span>
                                    <span className='text-md text-zinc-400 h-7 break-all overflow-ellipsis overflow-hidden w-18 text-nowrap'>{formatImage(container.image)}</span>
                                </div>
                            </div>
                            {panel == 'info' && container ? <ContainerInfo data={container}/> : <></>}
                        </div>
                    </ResizablePanel>
                </>}
            </ResizablePanelGroup>
        </ContainerViewContext.Provider>
    );
};

export default ContainerView;