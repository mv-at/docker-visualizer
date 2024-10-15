"use client";

import React, {useEffect, useState} from 'react';
import {ContainerData} from "@/types/ContainerData";
import Container from "@/components/Container";

const Containers = () => {

    const [containers, setContainers] = useState<ContainerData[]|undefined>();

    useEffect(() => {
        fetch('/api/docker/container').then(res => res.json()).then(setContainers);
        const cancel = setInterval(() => {
            fetch('/api/docker/container').then(res => res.json()).then(setContainers);
        }, 15000);
        return () => clearInterval(cancel);
    }, []);

    const removeContainer = (id: string) => {
        if (containers)
            setContainers(containers.filter(c => c.id !== id));
    }

    return (
        <div className='w-full p-10 flex flex-wrap gap-8 content-start justify-center items-center overflow-y-auto'>
            {containers && containers.sort((a, b) => a.name.localeCompare(b.name)).map((container, i) => <Container data={container} removeContainer={removeContainer} key={i}/>)}
            {containers === undefined && <div className='loader'/> }
        </div>
    );
};

export default Containers;