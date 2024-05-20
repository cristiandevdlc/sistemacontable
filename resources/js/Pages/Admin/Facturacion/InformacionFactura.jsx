import React from 'react';

const InformacionFactura = ({ facturacion,  cliente }) => {
    return (
        
        <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2'>
            {facturacion.folio !== 0 && (<div className='flex justify-between'> <span>Facturacion id: </span>{facturacion.folio ? facturacion.folio : ""}</div>)}
            <div className='flex justify-between'> <span>Calle: </span>{cliente.calle ? cliente.calle : "NO TIENE CALLE"}</div>
            <div className='flex justify-between'> <span>RFC: </span>{cliente.rfc ? cliente.rfc : "NO TIENE RFC"}</div>
            <div className='flex justify-between'> <span>Colonia: </span>{cliente.colonia ? cliente.colonia : "NO TIENE COLONIA"} </div>
            <div className='flex justify-between'> <span>No Exterior: </span># {cliente.numeroe ? cliente.numeroe : "S/N NUMERO EXTERIOR"} </div>
            <div className='flex justify-between'> <span>No Interior: </span># {cliente.numeroi ? cliente.numeroi : "S/N NUMERO INTERIOR"} </div>
            <div className='flex justify-between'> <span>Pais: </span>{cliente.pais ? cliente.pais : "NO TIENE PAIS"} </div>
            <div className='flex justify-between'> <span>Estado: </span>{cliente.estado ? cliente.estado : "NO TIENE ESTADO"} </div>
            <div className='flex justify-between'> <span>Telefono: </span>{cliente.telefono ? cliente.telefono : "NO TIENE TELEFONO"} </div>
            <div className='flex justify-between'> <span>CP: </span>{cliente.CP ? cliente.CP : "NO TIENE CP"} </div>
        </div>
    );
}

export default InformacionFactura;
