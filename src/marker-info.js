import React from 'react';
import { HelperListImages } from './Helper'

const imgStyle = {
    height: "100px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100px"
}

const MarkerInfo = (props) => {

    const { info } = props;
    const displayName = `${info.title}`;

    return (
        <div style={{ minWidth: "200px" }}>
            <div style={{ textAlign: "center" }}>
                {displayName}
            </div>
            {info.images ? <HelperListImages img={info.images[0].name} className="active-img" style={imgStyle} /> : 'We have not added any pictures yet'}
        </div>
    );
}

export default MarkerInfo;