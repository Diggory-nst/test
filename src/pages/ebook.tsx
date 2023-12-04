

import { Div, Container } from '../assets/styles/ebook.css';
import { Link, useParams } from 'react-router-dom';
import { useRef } from 'react';

import preloader from '../utils/preloader';
import configDomain from '../configs/config.domain';

import kiemLai from '../assets/images/kiem-lai.jpg'
import test from '../assets/images/background/phong_canh.jpg'

const Ebook = () => {

    const domain = configDomain?.domain

    // Get slug param
    const param = useParams()
    const slug = param.slug

    // Get data for page
    // const { data: ebook, isLoading, isError, messageError } = useGet(`${domain}/ebook/${slug}`, {})

    return (
        <Div className="ebook-page" style={{ backgroundImage: `url(${test})`, backgroundSize: 'cover' }}>
            <header>
                <Link to='/'>
                    <div className="cover-photo"></div>
                </Link>
                <div className="grid wide">
                    <div className="border-line"></div>
                    <div className="detail-story-header">
                        <img src={kiemLai} />
                        <div className="detail-story__info">
                            <h1 className='name-ebook'>Tiên Tử, Xin Nghe Ta Giải Thích</h1>
                            <div className="detail-story__info-1">
                                <div className="information-ebook">
                                    <span className="author-ebook">Phong Hỏa Hí Chư Hầu Phong Hỏa</span>
                                    <span className="status-ebook">Hoàn Thành</span>
                                    <h2 className="number-chapter-ebook">1790 <b>Chương</b></h2>
                                    <button className='btn-forward'>Đọc Truyện Tại Đây</button>
                                </div>
                                <div className="install-ebook">
                                    <h1>Tải Ebook</h1>
                                    <div className="part-ebook">
                                        <a className='list-chapter' href='/' >Danh sách chương</a>
                                        <ul>
                                            <li>
                                                <a href="/">Phần 1</a>
                                            </li>
                                            <li>
                                                <a href="/">Phần 2</a>
                                            </li>
                                            <li>
                                                <a href="/">Phần 3</a>
                                            </li>
                                            <li>
                                                <a href="/">Phần 4</a>
                                            </li>
                                            <li>
                                                <a href="/">Phần 5</a>
                                            </li>
                                            <li>
                                                <a href="/">Phần 6</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </Div>
    )
}

export default Ebook;