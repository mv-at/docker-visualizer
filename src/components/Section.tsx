"use client";

import React, {ReactNode, useState} from 'react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

const Section = (props: {title: string, defaultOpen: boolean, children?: ReactNode|ReactNode[]}) => {

    const [open, setOpen] = useState(props.defaultOpen);

    return (
        <Collapsible defaultOpen={props.defaultOpen} onOpenChange={open => setOpen(open)}>
            <CollapsibleTrigger className='flex text-white text-xl w-full border-b-[1px] pb-1'>
                <img className='ml-1 w-6 h-6 mr-2' src={open ? '/img/drawer_opened.svg' : '/img/drawer_closed.svg'}/>
                <span className='mb-1 leading-none'>{props.title}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                {props.children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Section;