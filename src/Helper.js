import React from "react";
import { Image } from 'react-bootstrap';

export const HelperListImages = (props) => {
    let {img, providedby} = props;

    try {
        img = require(`./img/viewpoints/${img}`);
    } catch (e) {
        console.log(e);
        img = `/external/img/viewpoints/${img}`;
    }
    return (
        <div style={{ position: 'relative' }}>
            <Image thumbnail responsive src={img} width='100%' height='100%' {...props} />
            <span className="image-provided-by" style={
                {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '50%',
                    height: '25%',
                    color: '#ffffff7d',
                    fontSize: '10px'
                }
            }>{providedby}</span>
        </div >
    )
}
