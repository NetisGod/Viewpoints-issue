import React from 'react'
import './FindViewpoint.css'

const FindViewpoint = (props) => {

    function handleToggleSwitchBtn(event) {
        const newActiveBtn = event.target.innerText.toLowerCase();
        props.handleSwitchBtn(newActiveBtn);
    }

    const switchBtn = (
        <div className="switch-btn" id="toggleSwitchBtn" onClick={handleToggleSwitchBtn}>
            <a className={"btn-list" + ' ' + (props.switchBtn.activeBtn === 'list' ? 'switch-btn-active' : '')} >List</a>
            <a className={"btn-map" + ' ' + (props.switchBtn.activeBtn === 'map' ? 'switch-btn-active' : '')} >Map</a>
        </div>
    );

    return (
        <div className="find-your-viewpoint">
            <span className="label">Find your Viewpoint</span>

            {props.switchBtn.isSwitchBtnVisible && switchBtn}
        </div>
    )
}

export default FindViewpoint;