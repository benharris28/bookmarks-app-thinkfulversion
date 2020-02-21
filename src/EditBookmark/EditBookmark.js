import React from  'react';
import BookmarksContext from '../BookmarksContext';

import config from '../config'
import './EditBookmark.css';


class EditBookmark extends React.Component {
    static contextType = BookmarksContext;

    
    state = {
        error: null,
        id: '',
        title: '',
        url: '',
        description: '',
        rating: 1
    }

    componentDidMount() {
        const { bookmarkId } = this.props.match.params

        fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
                
                  'Authorization': `Bearer ${config.API_KEY}`
                }
              })
                .then(res => {
                  if (!res.ok) 
                    return res.json().then(error => Promise.reject(error))

                  
                  return res.json()
                })
                .then(responseData => {
                    this.setState({
                        id: responseData.id,
                        title: responseData.title,
                        url: responseData.url,
                        description: responseData.description,
                        rating: responseData.rating,
                    })
                })
                
                .catch(error => {
                    console.error(error)
                    this.setState({ error })
            })
        }
    
    updateTitle = (name) => {
        this.setState({
            name: name
        });
    }

    updateUrl = (url) => {
        this.setState({
            url: url
        })
    }

    updateDescription = (description) => {
        this.setState({
            description: description
        })
    }

    updateRating = (rating) => {
        this.setState({
            rating: rating
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { bookmarkId } = this.props.match.params
        const { id, title, url, description, rating } = this.state
        const newBookmark = { id, title, url, description, rating }
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
          method: 'PATCH',
          body: JSON.stringify(newBookmark),
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${config.API_KEY}`
          },
        })
          .then(res => {
            if (!res.ok)
              return res.json().then(error => Promise.reject(error))
          })
          .then(() => {
            this.resetFields(newBookmark)
            this.context.updateBookmark(newBookmark)
            this.props.history.push('/')
          })
          .catch(error => {
            console.error(error)
            this.setState({ error })
          })
      }
    
      resetFields = (newFields) => {
        this.setState({
          id: newFields.id || '',
          title: newFields.title || '',
          url: newFields.url || '',
          description: newFields.description || '',
          rating: newFields.rating || '',
        })
      }
    
      handleClickCancel = () => {
        this.props.history.push('/')
      };
    
    
    
    render() {
        const { title, url, description, rating } = this.state
        return (
            <section className='edit-bookmark'>
                <h2>Edit Bookmark</h2>
                <form
                    classname="edit-bookmark-form"
                    onSubmit={e => this.handleSubmit(e)}>

                        <label htmlFor="title">
                            Bookmark Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={e => this.updateTitle(e.target.value)} />
                        
                        <label htmlFor="url">
                            URL
                        </label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            value={url}
                            onChange={e => this.updateUrl(e.target.value)} />
                        
                        <label htmlFor="description">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={description}
                            onChange={e => this.updateDescription(e.target.value)} />
                        
                        <label htmlFor="rating">
                            Rating
                        </label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            value={rating}
                            onChange={e => this.updateRating(e.target.value)} />
                    <button
                        type="submit">

                    </button>
                    <button type='button' onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                </form>
            </section>
        )
    }
}

export default EditBookmark;