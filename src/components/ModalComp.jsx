import React from 'react'
import InvitationModal from '../modals/InvitationModal'


const ModalComp = ({modal}) => {

  return (
  <>
    {
        modal == 'invitation' && (
            <InvitationModal/>
        )
    }
  </>
  )
}

export default ModalComp