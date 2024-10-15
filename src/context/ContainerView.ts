import {ContainerData} from "@/types/ContainerData";
import React from "react";

export type ContainerViewContextType = {
    setView?: (view: string, container: ContainerData) => void
    closeView?: () => void
}

export const ContainerViewContext = React.createContext<ContainerViewContextType>({});