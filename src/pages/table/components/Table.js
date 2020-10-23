
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
// import Rating from './Rating';

export default function TableOrder(props) {
    const { table } = props;
    return (
        <div className="card">
            <Button className="card-body"
                style={{ width: 180, height: 100 }}
                variant={`${table.status}` == "ເປີດ" ? "success" : "default"}
            >
                <div>
                    <span style={{ fontSize: 20 }}>ໂຕະ {` ${table.table_id}`}</span>
                </div>
                <div>
                    <span>{`${table.status}`}</span>
                </div>
            </Button>
        </div>
    );
}


