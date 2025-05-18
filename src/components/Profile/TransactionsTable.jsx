'use client'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import { exactPrice, formatDateMonth, isLogin, t } from '@/utils';
import { paymentTransactionApi } from '@/utils/api';
import { Table, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import UploadReceiptModal from '../PagesComponent/Transactions/UploadReceiptModal';

const TransactionsTable = () => {

    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [IsUploadRecipt, setIsUploadRecipt] = useState(false)
    const [transactionId, setTransactionId] = useState('')


    const handleUploadReceipt = (id) => {
        setTransactionId(id)
        setIsUploadRecipt(true)
    }


    const columns = [
        {
            title: t('id'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: t('paymentMethod'),
            dataIndex: 'payment_gateway',
            key: 'payment_gateway',
            align: 'center',
        },
        {
            title: t('transactionId'),
            dataIndex: 'order_id',
            key: 'order_id',
            align: 'center',
        },
        {
            title: t('date'),
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
            render: (text) => {
                return (
                    <span>{formatDateMonth(text)}</span>
                )
            }
        },
        {
            title: t('price'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (text) => exactPrice(text),
        },
        {
            title: t('status'),
            dataIndex: 'payment_status',
            key: 'payment_status',
            align: 'center',
            render: (text, record) => {
                let statusClassName = '';

                switch (text) {
                    case 'succeed':
                        statusClassName = 'success_status';
                        break;
                    case 'failed':
                        statusClassName = 'failed_status';
                        break;
                    case 'pending':
                        statusClassName = 'pending_status';
                        break;
                    case 'under review':
                        statusClassName = 'under_review_status';
                        break;
                    case 'rejected':
                        statusClassName = 'rejected_status';
                        break;
                    default:
                        statusClassName = '';
                        break;
                }

                return (
                    <div>

                        {record.payment_gateway === 'BankTransfer' && text === 'pending' ? (
                            <button
                                className="upload_receipt_button"
                                onClick={() => handleUploadReceipt(record.id)}
                            >
                                {t('uploadReceipt')}
                            </button>
                        )
                            :
                            <span className={statusClassName}>{text}</span>
                        }
                    </div>
                );
            },
        },
    ];

    const skeletonColumns = columns.map((col) => ({
        ...col,
        render: () => (
            <Skeleton.Input active size="default" style={{ width: '50%' }} />
        ),
    }));

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const res = await paymentTransactionApi.transaction({});
            const { data } = res.data;
            setData(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLogin()) {
            fetchTransactions()
        }
    }, []);

    const paginationOptions = {
        pageSize: 10,
        showTotal: (total, range) => {
            const startEntry = range[0];
            const endEntry = range[1] > total ? total : range[1];
            return `Showing ${startEntry} to ${endEntry} of ${total} entries`;
        },
    };

    return (
        <>
            {isLoading ? (
                <Table
                    columns={skeletonColumns}
                    dataSource={Array.from({ length: 10 }, (_, index) => ({ key: index }))}
                    className="notif_table"
                    pagination={false}
                />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    className="notif_table"
                    pagination={paginationOptions}
                />
            )}
            <UploadReceiptModal IsUploadRecipt={IsUploadRecipt} setIsUploadRecipt={setIsUploadRecipt} transactionId={transactionId} setData={setData} />
        </>
    );
};

export default TransactionsTable;
