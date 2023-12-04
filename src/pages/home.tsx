
import '../assets/styles/base.css'
import '../assets/styles/grid_system.css'

import { Div, Story } from '../assets/styles/home.css'
import Header from '../components/home/header'
import Footer from '../components/home/footer'

import { Link } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import { useEffect, useState } from 'react'

import axios from 'axios'
import configDomain from '../configs/config.domain'

interface Ebook {
    _id: string,
    name: string,
    slug: string,
    author: string,
    status: string,
    chap_number: string,
    image: string,
}

const Home = () => {

    const domain = configDomain?.domain

    const [isError, setIsError] = useState<boolean>(false)
    const [messageError, setMessageError] = useState<string>('')

    const [ebooks, setEbooks] = useState<Ebook[]>([])
    const [filterEbook, setFilterEbook] = useState<string>('moinhat')

    const getEbooks = async (status: string) => {

        setFilterEbook(status)

        const url = `${domain}`

        try {
            const res = await axios.get(url, { params: { status } })
            const ebooks = res.data.metadata.ebooks

            if (ebooks.length === 0) {
                setIsError(true)
                setMessageError('Không Có Ebook Nào')
                return
            }

            setIsError(false)
            setEbooks(ebooks)
        } catch (error: any) {
            setIsError(true)
            setMessageError(error.response.data.message)
        }
    }

    useEffect(() => {
        getEbooks('moinhat')
    }, [])

    return (
        <Div className='home-page'>
            <Header />
            <div className='space'></div>
            <div className="container">
                <div className="grid wide">
                    <Story className="section-story">
                        <div className="sum-story">
                            <div className='number-of-story'>
                                <IonIcon name="dice-outline"></IonIcon>
                                <h1>{ebooks.length} Truyện ( Tất cả Ebook đều là Dịch thuần Việt )</h1>
                            </div>
                            <div className='sort-by'>
                                <h1 className={filterEbook === 'moinhat' ? 'active' : 'no-active'} onClick={() => getEbooks('moinhat')}>Mới Nhất</h1>
                                <h1 className={filterEbook === 'hoanthanh' ? 'active' : 'no-active'} onClick={() => getEbooks('hoanthanh')}>Hoàn Thành</h1>
                                <h1 className={filterEbook === 'dangra' ? 'active' : 'no-active'} onClick={() => getEbooks('dangra')}>Đang Ra</h1>
                            </div>
                        </div>
                        <div className="list-story">
                            {isError === false ?
                                <div className='have-ebook'>
                                    {ebooks.map(ebook => {
                                        return (
                                            <Link to={`/ebook/${ebook.slug}`} className="item-story" key={ebook._id}>
                                                <div className="image">
                                                    <img src={`${domain}/images/` + ebook.image} />
                                                </div>
                                                <div className="information">
                                                    <h1 className="name">{ebook.name}</h1>
                                                    <h1 className="author">{ebook.author}</h1>
                                                    <h1 className="status">{ebook.status}</h1>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                :
                                <div className='non-ebook'>
                                    <h1>{messageError}</h1>
                                </div>
                            }
                        </div>
                    </Story>
                </div>
            </div>
            <Footer />
        </Div>
    )
}

export default Home;