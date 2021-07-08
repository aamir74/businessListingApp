import React from 'react';
import { useState } from 'react'
import Modal from '../shared/Modal';
import './SignupModal.css'
import { MdCancel } from 'react-icons/md'
const SignupModal = props => {
  
  return (
    <Modal
      className="wrap"
      onCancel={props.onClear}
      header={<p>Sign up for a free business account</p>}
      cancelIcon={<MdCancel size={20} onClick={props.onClear} />}
      show={!!props.show}
    />
  )
}

export default SignupModal
