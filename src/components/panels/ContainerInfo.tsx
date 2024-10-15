"use client";

import React, {useEffect} from 'react';
import {ContainerData} from "@/types/ContainerData";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import Section from "@/components/Section";

const ContainerInfo = (props: {data: ContainerData}) => {
    return (
        <>
            <Section title='Container stats' defaultOpen={true}>
                <span>Content</span>
            </Section>
            <Section title='Labels' defaultOpen={false}>
                <span>Content</span>
            </Section>
        </>
    );
};

export default ContainerInfo;