import '../../sass/TabsEncuesta/_tabs.scss';
export function ControlPanelComp({
    option1 = '',
    option2 = '',
    option3 = '',
    icon1 = <></>,
    icon2 = <></>,
    icon3 = <></>,
    controlProps = () => { },
}) {

    return (<>
        <div className='container-encuesta '>
            <div className="tabs-encuesta">
                <input type="radio" {...controlProps(0)} id="radio-1" name="tabs" />
                <label className="tab !m-0 !text-[14px]" htmlFor="radio-1"> {icon1} <span className="ms-1 md:flex hidden">{option1}</span></label>
                <span className="gliderAddressOrders"></span>

                <input type="radio" {...controlProps(1)} id="radio-2" name="tabs" />
                <label className="tab !m-0 !text-[14px]" htmlFor="radio-2"> {icon2} <span className="ms-1 md:flex hidden">{option2}</span> </label>
                <span className="gliderAddressOrders"></span>

                <input type="radio" {...controlProps(2)} id="radio-3" name="tabs" />
                <label className="tab !m-0 !text-[14px]" htmlFor="radio-3"> {icon3} <span className="ms-1 md:flex hidden">{option3}</span> </label>
                <span className="gliderAddressOrders"></span>
            </div>
        </div>
    </>)
}