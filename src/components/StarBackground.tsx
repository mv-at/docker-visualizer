import React, {ReactNode} from 'react';
import '../styles/starBackground.css';

const StarBackground = (props: {
    children?: ReactNode | ReactNode[],
    className?: string
}) => {
    return (
        <>
            <div className='starBackground'>
                <div className='stars'/>
                <div className='stars2'/>
                <div className='stars3'/>
            </div>
            <div className={'absolute inset-0 ' + props.className || ''} >
                {props.children}
            </div>
        </>
    );
};

export default StarBackground;