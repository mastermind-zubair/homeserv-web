import { Card } from 'antd';
import React from 'react';

function SelectedCard(props) {

    return (
        <>
            <Card
            headStyle={{
                fontSize: "18px",
                borderLeft: `solid 3px ${props.isSelected ? "orange" : "#cadeff"}`,
                color: `${props.isSelected ? "#dd6633" : "#555"}`,
                backgroundColor: `${props.isSelected ? "gold" : "#ccc"}`,
              }}
              bodyStyle={{ borderLeft: `solid 3px ${props.isSelected ? "orange" : "#cadeff"}` }}
             {...props}>
                {props.children}
            </Card>        
        </>
    );
}

export default SelectedCard;