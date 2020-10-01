import React from 'react';
import useReactRouter from "use-react-router";
import CustomNav from './component/CustomNav';


const ServedOrder = () => {
    const { history, location, match } = useReactRouter();
    console.log("location: ", location)
    console.log("match: ", match)
    return   <div>
            <CustomNav default="/orders/served/pagenumber/1" />
        </div>
    
};

export default ServedOrder;
