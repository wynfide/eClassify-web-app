'use client'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'
import { t } from '@/utils'
import { Checkbox, Radio } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import toast from 'react-hot-toast'
import { FaAngleDown } from 'react-icons/fa6'
import { HiOutlineUpload } from 'react-icons/hi'
import { MdOutlineAttachFile } from 'react-icons/md'
import { useSelector } from 'react-redux'

const ContentThree = ({ CustomFields, extraDetails, setExtraDetails, submitExtraDetails, handleGoBack, filePreviews, setFilePreviews }) => {

    const CurrentLanguage = useSelector(CurrentLanguageData)

    const handleFileChange = (id, file) => {
        if (file) {
            const allowedExtensions = /\.(jpg|jpeg|svg|png|pdf)$/i;
            if (!allowedExtensions.test(file.name)) {
                toast.error(t('notAllowedFile'));
                return;
            }
            const fileUrl = URL.createObjectURL(file);
            setFilePreviews(prevPreviews => ({
                ...prevPreviews,
                [id]: {
                    url: fileUrl,
                    isPdf: /\.pdf$/i.test(file.name)
                }
            }));
            setExtraDetails((prevDetails) => ({
                ...prevDetails,
                [id]: file
            }));
        }
    };

    const handleChange = (id, value) => {
        setExtraDetails((prevDetails) => ({ ...prevDetails, [id]: value !== null ? value : '' }));
    };

    function inpNum(e) {
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var charStr = String.fromCharCode(charCode);
        if (!charStr.match(/^[0-9]+$/)) {
            e.preventDefault();
        }
    }

    const handleCheckboxChange = (id, value, checked) => {
        setExtraDetails((prevDetails) => {
            const newValue = checked
                ? [...(prevDetails[id] || []), value]
                : (prevDetails[id] || []).filter((v) => v !== value);
            return { ...prevDetails, [id]: newValue };
        });
    };


    const handleKeyDown = (e, maxLength) => {

        if (maxLength === null || maxLength === undefined) {
            return
        }
        const value = e.target.value;
        // Allow control keys (Backspace, Delete, Arrow keys, etc.)
        const controlKeys = [
            'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab',
        ];

        if (
            value.length >= maxLength &&
            !controlKeys.includes(e.key)
        ) {
            e.preventDefault();
        }
    };



    const renderInputField = (field) => {
        let { id, name, type, required, values, min_length, max_length, is_required } = field;

        const inputProps = {
            id,
            name,
            required: !!is_required,
            onChange: (e) => handleChange(id, e.target.value),
            value: extraDetails[id] || '',
            ...(type === 'number'
                ? { min: min_length, max: max_length }
                : { minLength: min_length, maxLength: max_length }
            )
        };
        switch (type) {
            case 'text':
            case 'number':

                {
                    return <div className="input-container">
                        <input
                            type={type}
                            inputMode={type === 'number' && 'numeric'}
                            placeholder={`${t('enter')} ${name}`}
                            {...inputProps}
                            onKeyDown={(e) => type === 'number' && handleKeyDown(e, max_length)}
                            onKeyPress={(e) => inpNum(e)}
                            className={`${extraDetails[id] ? 'bg' : ''}`}
                        />
                        {max_length && (
                            <span className='inputLength'>
                                {`${extraDetails[id] ? extraDetails[id].length : 0}/${max_length}`}
                            </span>
                        )}
                    </div>
                }
            case 'textbox':
                return <div className="input-container">
                    <textarea
                        placeholder={`${t('enter')} ${name}`}
                        className={`${extraDetails[id] ? 'bg' : ''}`}
                        {...inputProps}
                    />
                    {max_length !== null && (
                        <span className='fixed-right'>
                            {`${extraDetails[id] ? extraDetails[id].length : 0}/${max_length}`}
                        </span>
                    )}
                </div>
            case 'fileinput':
                const fileUrl = filePreviews[id]?.url;
                return (
                    <>
                        <label htmlFor={id} className='fileinput_wrap'>
                            <div className='click_upld_wrap'>
                                <HiOutlineUpload size={24} fontWeight='400' />
                            </div>
                            {filePreviews[id] && (
                                <div className='file_wrap'>
                                    {filePreviews[id]?.isPdf ? (
                                        <>
                                            <MdOutlineAttachFile className='file_icon' />
                                            <Link href={fileUrl} target="_blank" rel="noopener noreferrer">{t('viewPdf')}</Link>
                                        </>
                                    ) : (
                                        <Image src={fileUrl} alt="Preview" width={36} height={36} className="file_preview" />
                                    )}
                                </div>
                            )}

                        </label>
                        <input type="file" id={id} name={name} className='fileinput' onChange={(e) => handleFileChange(id, e.target.files[0])} required={required === 1} />
                        <span className='allowed_type'>{t('allowedFileType')}</span>
                    </>
                )
            case 'dropdown':
                return (
                    <div className="cat_select_wrapper">
                        <select {...inputProps} className='bg extra_det_select'>
                            <option value="">{t('select')} {name}</option>
                            {values?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <FaAngleDown className='cat_select_arrow' />
                    </div>
                );
            case 'checkbox':

                return (
                    <div className='date_posted_checkbox extradet_checkbox'>
                        {values?.map((value, index) => (
                            <Checkbox
                                key={value}
                                value={value}
                                checked={extraDetails[id]?.includes(value)}
                                onChange={(e) => handleCheckboxChange(id, e.target.value, e.target.checked)}
                            >
                                {value}
                            </Checkbox>
                        ))}
                    </div>
                );
            case 'radio':
                return (
                    <Radio.Group {...inputProps} className='radio_group extradet_radio_group' onChange={(e) => handleChange(id, e.target.value)}>
                        {values?.map((option) => (
                            <Radio key={option} value={option}>{option}</Radio>
                        ))}
                    </Radio.Group>
                );
            default:
                return null;
        }
    };


    return (
        <>
            <div className="col-12">
                <div className="row formWrapper">
                    {CustomFields.map((field) => (
                        <div key={field.id} className="col-12 col-lg-6">
                            <div className='extraLabelCont'>
                                <Image src={field?.image} width={30} height={30} />
                                <label className={`${field?.required ? 'auth_label' : 'auth_pers_label'}`} htmlFor={field.id}>{field.name}</label>
                            </div>
                            {renderInputField(field)}
                        </div>
                    ))}

                    <div className="formBtns">
                        <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                        <button type='button' className='nextBtn' onClick={submitExtraDetails}>{t('next')}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentThree
