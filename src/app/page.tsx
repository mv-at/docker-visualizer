import ContainerView from "@/components/ContainerView";
import StarBackground from "@/components/StarBackground";
import React from "react";

export default function Home() {
    return (
        <StarBackground className='absolute inset-0 flex flex-col overflow-hidden'>
            <div className='flex flex-col flex-1 justify-center items-center'>
                <ContainerView/>
            </div>
            <a href='https://github.com/mv-at/docker-visualizer' target='_blank' className='absolute left-2 bottom-2'>
                <img src='/img/github.svg' alt='icon' className='h-10 w-10 contrast-75 hover:contrast-100 cursor-pointer'/>
            </a>
        </StarBackground>
    );
}
