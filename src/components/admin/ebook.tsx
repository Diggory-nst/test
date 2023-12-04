
import { useEffect, useRef, useState } from "react"
import configDomain from "../../configs/config.domain"
import axios from "axios"
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux'

import { showToastAdmin } from "../../redux";
import { Div } from "../../assets/styles/admin/ebook.css";

import IonIcon from "@reacticons/ionicons"
import Pagination from "../pagination";
import capitalizedText from "../../utils/capitalizedText";

interface Props {
    headers: {
        ['Content-Type']: string | null,
        ['x-client-id']: string | null,
        authorization: string | null,
        ['x-rtoken-id']: string | null
    }
}

interface EbookType {
    _id: string,
    name: string,
    author: string,
    status: string,
    chap_number: string
}

const Ebook: React.FC<Props> = ({ headers }) => {

    const dispatch = useDispatch()

    const domain = configDomain?.domain

    const [isErrorEbook, setIsErrorEbook] = useState<boolean>(false)
    const [messageErrorEbook, setMessageErrorEbook] = useState<string>('')

    const [errorAddEbook, setErrorAddEbook] = useState<boolean>(false)
    const [messageErrorAddEbook, setMessageErrorAddEbook] = useState<string>('')
    const [errorEditEbook, setErrorEditEbook] = useState<boolean>(false)
    const [messageErrorEditEbook, setMessageErrorEditEbook] = useState<string>('')

    const [filterEbook, setFilterEbook] = useState<string>('Hoàn Thành')

    const [ebooks, setEbooks] = useState<EbookType[]>([])

    const [ebook, setEbook] = useState<EbookType>({
        _id: '',
        name: '',
        author: '',
        status: 'Hoàn Thành',
        chap_number: ''
    })

    const [fileImage, setFileImage] = useState<any>(null)
    const [fileListChapter, setFileListChapter] = useState<any>(null)
    const [fileEbook, setFileEbook] = useState<any>(null)

    // Pagination
    const [totalDc, setTotalDc] = useState<number>(0)
    const limitPage = useRef(2)
    const currentPage = useSelector((state: { pagination: { currentPage: number } }) => {
        return state.pagination.currentPage
    })

    // Pop up
    const modalRef = useRef(null)
    const modalAddEbookRef = useRef(null)
    const modalEditEbookRef = useRef(null)

    const [modalTag, setModalTag] = useState<HTMLDivElement | null>(null)
    const [modalAddEbookTag, setModalAddEbookTag] = useState<HTMLDivElement | null>(null)
    const [modalEditEbookTag, setModalEditEbookTag] = useState<HTMLDivElement | null>(null)

    // Fetch Data Ebook
    const getAllEbook = async (status: string) => {

        setFilterEbook(status)

        const url = `${domain}/admin/get-ebooks`

        // Get Data Ebook
        try {

            const res = await axios.get(url, { headers, params: { status, limit: limitPage.current, currentPage } })
            const { ebooks, totalDc } = res.data.metadata

            if (ebooks === 0) {
                setIsErrorEbook(true)
                setMessageErrorEbook('Không Có Ebook Nào')
                return
            }

            setTotalDc(totalDc)
            setIsErrorEbook(false)
            setEbooks(ebooks)
        } catch (error: any) {
            setIsErrorEbook(true)
            setMessageErrorEbook(error.response.data.message)
        }
    }

    useEffect(() => {
        getAllEbook(filterEbook)
    }, [currentPage])

    // Handle Pop up
    useEffect(() => {
        setModalTag(modalRef.current)
        setModalAddEbookTag(modalAddEbookRef.current)
        setModalEditEbookTag(modalEditEbookRef.current)
    }, [ebooks])

    const openModalAddEbook = () => {
        if (!modalTag || !modalAddEbookTag) return
        modalTag.style.display = 'flex'
        modalAddEbookTag.style.display = 'block'
    }

    const openModalEditEbook = (indexEbook: number) => {
        if (!modalTag || !modalEditEbookTag) return
        modalTag.style.display = 'flex'
        modalEditEbookTag.style.display = 'block'

        setEbook(ebooks[indexEbook])
    }

    const closeModal = (section: string) => {
        switch (section) {
            case 'addEbook':
                if (!modalTag || !modalAddEbookTag) return
                modalAddEbookTag.style.display = 'none'
                modalTag.style.display = 'none'
                break;
            case 'editEbook':
                if (!modalTag || !modalEditEbookTag) return
                modalEditEbookTag.style.display = 'none'
                modalTag.style.display = 'none'
                break;
            default:
                break;
        }
    }

    // Handle Change
    const handleChangeEbook = (e: any) => {
        setEbook(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const checkFileEbook = () => {

        const name_file_ebook = fileEbook.name
        const size_file_ebook = fileEbook.size
        const name_file_list = fileListChapter.name
        const size_file_list = fileListChapter.size
        const max_size = 1024 * 1024 * 5 // 5MB

        const check_name_file_ebook = name_file_ebook.substring(name_file_ebook.length - 3)
        const check_name_file_list = name_file_list.substring(name_file_list.length - 3)

        if (check_name_file_ebook !== '.dg' || check_name_file_list !== '.dg') {
            setErrorAddEbook(true)
            setMessageErrorAddEbook('File Không Hợp Lệ')
            return
        }

        if (size_file_ebook > max_size || size_file_list > max_size) {
            setErrorAddEbook(true)
            setMessageErrorAddEbook('File Phải Nhỏ Hơn 5MB')
            return
        }
    }

    // Handle User

    const addEbook = async () => {

        if (ebook.name === '' || ebook.author === '' || ebook.chap_number === '' || !fileImage || !fileEbook) return

        checkFileEbook()

        const name = capitalizedText(ebook.name)
        const author = capitalizedText(ebook.author)
        const status = capitalizedText(ebook.status)

        const url = `${domain}/admin/new-ebook`
        const data = {
            name,
            author,
            status,
            chap_number: ebook.chap_number,
            image: fileImage,
            listChapter: fileListChapter,
            ebook: fileEbook
        }

        console.log(data);

        try {
            const res = await axios.post(url, data, {
                headers: {
                    ...headers,
                    "Content-Type": 'multipart/form-data'
                }
            })
            const ebook = res.data.metadata.ebook

            setEbooks([
                ...ebooks,
                ebook
            ])
            setEbook({
                _id: '',
                name: '',
                author: '',
                status: '',
                chap_number: ''
            })
            setFileEbook(null)
            setFileImage(null)
            closeModal('addEbook')
        } catch (error: any) {
            setErrorAddEbook(true)
            setMessageErrorAddEbook(error.response.data.message)
        }
    }

    const deleteEbook = async (ebook_id: string) => {
        try {
            axios.get(`${domain}/admin/delete-ebook/${ebook_id}`, { headers })
        } catch (error: any) {
            dispatch(showToastAdmin({ showToast: true, messageToast: error.response.data.message, typeToast: 'error' }))
        }

        const new_ebooks = ebooks.filter(item => item._id != ebook_id)
        setEbooks(new_ebooks)
    }

    const editEbook = async (ebook_id: string) => {

        checkFileEbook()

        const url = `${domain}/admin/edit-ebook/${ebook_id}`
        const data = ebook

        try {
            await axios.patch(url, data, { headers })
        } catch (error: any) {
            setErrorEditEbook(true)
            setMessageErrorEditEbook(error.response.data.message)
        }

        const ebooksAfterUpdate = ebooks.map(item => {
            if (item._id === ebook_id) {
                return {
                    ...item,
                    name: ebook.name,
                    author: ebook.author,
                    status: ebook.status,
                    chap_number: ebook.chap_number
                }
            } else {
                return item
            }
        })

        setEbooks(ebooksAfterUpdate)
        closeModal('editEbook')
    }

    return (
        <Div className="ebooks">
            <div className="add-ebook" onClick={openModalAddEbook}>
                <span>Thêm Ebook</span>
            </div>
            <div className="report-filter">
                <span className={filterEbook === 'Hoàn Thành' ? 'act' : 'inact'} onClick={() => getAllEbook('Hoàn Thành')}>Hoàn Thành</span>
                <span className={filterEbook === 'Đang Ra' ? 'act' : 'inact'} onClick={() => getAllEbook('Đang Ra')}>Đang Ra</span>
            </div>
            {isErrorEbook === false ?
                <div className="row" style={{ minHeight: '244px' }}>
                    {ebooks.map((ebook, index) => {
                        return (
                            <div className="col l-6" key={ebook._id}>
                                <div className="ebook">
                                    <span className="ebook-name">{ebook.name}</span>
                                    <span className="ebook-delete" onClick={() => deleteEbook(ebook._id)}>Delete</span>
                                    <span className="ebook-edit" onClick={() => openModalEditEbook(index)}>Edit</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                :
                <div className="error" style={{ height: 'calc(100% - 94px)' }}>
                    <h1>{messageErrorEbook}</h1>
                </div>
            }
            {isErrorEbook === false && totalDc > limitPage.current && <Pagination totalDc={totalDc} limitPage={limitPage.current} />}
            <div className="modal" style={{ display: 'none' }} ref={modalRef} >
                <div className="modal-overlay"></div>
                <div className="modal-body__addEbook" style={{ display: 'none', height: errorAddEbook ? '468px' : '438px' }} ref={modalAddEbookRef}>
                    <div className="icon-close" onClick={() => closeModal('addEbook')}>
                        <span id="icon-close-2">
                            <IonIcon name="close-outline"></IonIcon>
                        </span>
                    </div>
                    <div className="information-ebook">
                        <div className="form-group">
                            <label>Tên Truyện</label>
                            <input type="text" value={ebook.name} name="name" onChange={handleChangeEbook} />
                        </div>
                        <div className="form-group">
                            <label>Tác Giả</label>
                            <input type="text" value={ebook.author} name="author" onChange={handleChangeEbook} />
                        </div>
                        <div className="form-group">
                            <label>Số Chương</label>
                            <input type="text" value={ebook.chap_number} name="chap_number" onChange={handleChangeEbook} />
                        </div>
                        <div className="form-group">
                            <label>Trạng Thái</label>
                            <select value={ebook.status} name="status" onChange={handleChangeEbook}>
                                <option value="Hoàn Thành">Hoàn Thành</option>
                                <option value="Đang Ra">Đang Ra</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image</label>
                            <input type="file" name="image" onChange={e => setFileImage(e.target.files?.[0])} />
                        </div>
                        <div className="form-group">
                            <label>File Danh Sách Chương</label>
                            <input type="file" name="listChapter" onChange={e => setFileListChapter(e.target.files?.[0])} />
                        </div>
                        <div className="form-group">
                            <label>File Ebook</label>
                            <input type="file" name="ebook" onChange={e => setFileEbook(e.target.files?.[0])} />
                        </div>
                        {errorAddEbook && <h1 style={{ textAlign: "center", color: 'red', fontSize: '1.6rem' }}>{messageErrorAddEbook}</h1>}
                    </div>
                    <div className="save-info" onClick={() => addEbook()}>Lưu Lại</div>
                </div>
                {ebooks.length > 0 &&
                    <div className="modal-body__editEbook" style={{ display: 'none', height: errorEditEbook ? '468px' : '438px' }} ref={modalEditEbookRef}>
                        <div className="icon-close" onClick={() => closeModal('editEbook')}>
                            <span id="icon-close-2">
                                <IonIcon name="close-outline"></IonIcon>
                            </span>
                        </div>
                        <div className="information-ebook">
                            <div className="form-group">
                                <label>Tên Truyện</label>
                                <input type="text" value={ebook.name} name="name" onChange={handleChangeEbook} />
                            </div>
                            <div className="form-group">
                                <label>Tác Giả</label>
                                <input type="text" value={ebook.author} name="author" onChange={handleChangeEbook} />
                            </div>
                            <div className="form-group">
                                <label>Số Chương</label>
                                <input type="text" value={ebook.chap_number} name="chap_number" onChange={handleChangeEbook} />
                            </div>
                            <div className="form-group">
                                <label>Trạng Thái</label>
                                <select value={ebook.status} name="status" onChange={handleChangeEbook}>
                                    <option value="Hoàn Thành">Hoàn Thành</option>
                                    <option value="Đang Ra">Đang Ra</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input type="file" name="image" onChange={e => setFileImage(e.target.files?.[0])} />
                            </div>
                            <div className="form-group">
                                <label>File Danh Sách Chương</label>
                                <input type="file" name="listChapter" onChange={e => setFileListChapter(e.target.files?.[0])} />
                            </div>
                            <div className="form-group">
                                <label>File Ebook</label>
                                <input type="file" name="ebook" onChange={e => setFileEbook(e.target.files?.[0])} />
                            </div>
                            {errorEditEbook && <h1 style={{ textAlign: "center", color: 'red', fontSize: '1.6rem' }}>{messageErrorEditEbook}</h1>}
                        </div>
                        <div className="save-info" onClick={() => editEbook(ebook._id)}>Lưu Lại</div>
                    </div>
                }
            </div>
        </Div>
    )
}

export default Ebook;