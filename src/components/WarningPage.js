import React, { Component } from 'react'


class Warning extends Component {
    state = { readOnly: false }

    render() {
        return (
            <section id="warning">
                <div class="conatiner warning">
                    <h1>To see your shopping cart, kindly login to your account!</h1>
                </div>
            </section>
        )
    }
}

export default Warning