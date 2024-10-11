import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import {END_POINT_SEVER} from '../../constants/api'

const banks = [
  { name: 'BCEL', code: 'BCEL001' },
  { name: 'Lao Development Bank', code: 'LDB001' },
  { name: 'Banque Pour Le Commerce Exterieur Lao', code: 'BCEL002' },
  { name: 'Agricultural Promotion Bank', code: 'APB001' },
  { name: 'Lao-Viet Bank', code: 'LVB001' },
  { name: 'Joint Development Bank', code: 'JDB001' },
  { name: 'ACLEDA Bank Lao', code: 'ACLEDA001' },
  { name: 'Lao People’s Revolutionary Bank', code: 'LPRB001' },
  { name: 'Indochina Bank', code: 'IB001' },
  { name: 'Lao Micro Finance', code: 'LMF001' },
  { name: 'Lao National Bank', code: 'LNB001' },
  { name: 'Phongsavanh Bank', code: 'PSB001' },
  { name: 'Vientiane Commercial Bank', code: 'VCB001' },
  { name: 'Vientiane Bank', code: 'VB001' },
  { name: 'Savan Bank', code: 'SB001' },
];


const BankList = () => {
  const [activeBanks, setActiveBanks] = useState({});
  const [bankIds, setBankIds] = useState({}); // Store bank ids

  useEffect(() => {
    const fetchActiveBanks = async () => {
      try {
        const response = await axios.get(`${END_POINT_SEVER}/v3/bank/getActiveBanks`);
        const activeBankData = response.data;

        const initialState = banks.reduce((acc, bank) => {
          const activeBank = activeBankData.find(active => active.bankCode === bank.code);
          acc[bank.code] = !!activeBank; // true if found, false otherwise
          return acc;
        }, {});

        const bankIdState = banks.reduce((acc, bank) => {
          const activeBank = activeBankData.find(active => active.bankCode === bank.code);
          if (activeBank) acc[bank.code] = activeBank._id; // Store bank id
          return acc;
        }, {});

        setActiveBanks(initialState);
        setBankIds(bankIdState); // Set the bank ids
      } catch (error) {
        console.error('Error fetching active banks:', error);
      }
    };

    fetchActiveBanks();
  }, [activeBanks]);

  const handleToggle = async (bankCode, bankName, isActive) => {
    try {
      if (isActive) {
        await axios.post(`${END_POINT_SEVER}/v3/bank/create`, {
          bankName,
          bankCode,
          createdBy: '652fa9dfc3a5c67a1b8e9f26'
        });
      } else {
        const bankId = bankIds[bankCode]; // Get the bankId
        if (bankId) {
          await axios.delete(`${END_POINT_SEVER}/v3/bank/delete/${bankId}`);
        }
      }
      setActiveBanks(prev => ({ ...prev, [bankCode]: isActive }));
    } catch (error) {
      console.error('Error toggling bank status:', error);
    }
  };

  return (
    <div className="bank-list">
      <h1>Lao Banks</h1>
      <ul>
        {banks.map(bank => (
          <li key={bank.code}>
            <span>{bank.name}</span>
            <Switch
              checked={activeBanks[bank.code]}
              onChange={(isActive) => handleToggle(bank.code, bank.name, isActive)}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              offColor="#888"
              offHandleColor="#444"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={48}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BankList;
