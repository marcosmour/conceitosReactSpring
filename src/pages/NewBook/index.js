import React, {useState, useEffect} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import{ FiArrowLeft} from 'react-icons/fi'

import api from "../../services/api";

import './styles.css';

import logoImage from '../../assets/logo.svg';

export default function NewBook(){
    const [id, setId] = useState(null);
    const [author, setAuthor] = useState('');
    const [launchDate, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');

    const {bookId} = useParams();

    const username = localStorage.getItem('username');
    const accessToken=localStorage.getItem('accessToken');
    
    const navigate = useNavigate();

    async function loadBook(){
        try {
            const response = await api.get(`api/book/v1/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                })

                let adjusteDate = (response.data.launchDate.split("T", 10)[0])// criado para formatar o modelo da data

                setId(response.data.id);
                setTitle(response.data.title);
                setAuthor(response.data.author);
                setPrice(response.data.price);
                setLaunchDate(adjusteDate);
        } catch (error) {
            alert('Error recovering Book! Try again!');
            navigate('/books');
        }
    }
    
    useEffect(() => {
        if (bookId === '0') return;   
         else loadBook();
        
    }, [bookId])

    async function createNewBook(e){
        e.preventDefault();

        const data = {
            title,
            author,
            launchDate,
            price,
        }

        const authorization = {
            Authorization: `Bearer ${accessToken}`
        }

        try {
             await api.post('api/book/v1', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate('/books');
        } catch (err) {
            alert('Error while recording Book! Try again')
        }
}
    return(
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={logoImage} alt="Erudio" />
                    <h1>Add New Book</h1>
                    <p>Enter the book information and click on 'Add' ! #### {bookId}</p>
                    <Link className="back-link" to= "/books">
                        <FiArrowLeft size={16} color="#251fc5" />
                        Home
                    </Link>
                </section>
                <form onSubmit={createNewBook}>
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                         />
                    <input
                        placeholder="Author"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                         />
                    <input
                        type="date"
                        value={launchDate}
                        onChange={e => setLaunchDate(e.target.value)}
                         />
                    <input
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                         />

                    <button className="button" type="submit">Add</button>
                </form>
            </div>
        </div>
    );
    }