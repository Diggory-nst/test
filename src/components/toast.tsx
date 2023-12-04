
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, memo } from 'react';
import { showToastAccount } from '../redux';
import IonIcon from '@reacticons/ionicons';

const Toast = () => {

    const dispatch = useDispatch()

    const { showToast, typeToast, messageToast } = useSelector((state: {
        generalAccount: {
            showToast: boolean,
            typeToast: string,
            messageToast: string
        }
    }) => {
        return state.generalAccount
    })

    useEffect(() => {

        let clearSetTime: number

        if (showToast) {
            clearSetTime = setTimeout(() => {
                dispatch(showToastAccount({ showToast: false, typeToast: 'success', messageToast: '' }))
            }, 3500)
        }

        return () => {
            clearTimeout(clearSetTime)
        }
    }, [showToast])

    return (
        <div id="toast">
            {showToast &&
                <div className="toast">
                    {typeToast === 'success' &&
                        <IonIcon name="checkmark-outline" style={{ backgroundColor: "#33c333" }}></IonIcon>
                    }
                    {typeToast === "error" &&
                        <IonIcon name="alert-outline"></IonIcon>
                    }
                    <h1>{messageToast}</h1>
                </div>
            }
        </div>
    )
}

export default memo(Toast);