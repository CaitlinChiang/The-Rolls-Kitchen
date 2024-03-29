import React, { Component } from 'react'
import * as firebase from 'firebase'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addMonths, getDay } from 'date-fns'
import moment from 'moment'


class View extends Component {
	state = {
		consumer: '',

		allOrders: [],
		pickupOrders: [],
		deliveryOrders: [],

		person: '',
		purchase: '',
		items: [],
		instructions: [],

		paymentStatus: 'Payment Confirmed',
		orderStatus: 'Ready',
		contacted: true,

		methodFilter: '',
		dateFilter: '',
		searchOrder: ''
	}

	componentDidMount = async () => {
		this.allData()
		this.pickup()
		this.delivery()
	}

	handleChange = (event) => {
		event.preventDefault()
		const {name, value} = event.target
		this.setState({ [name]: value })
	}

	handleOrderChange = (event) => {
		event.preventDefault()
		const {name, value} = event.target
		this.setState({ [name]: value })

		this.setState({ allOrders: [] })

		this.allData()
	}

	handleDateChange = (date) => {
		this.setState({ allOrders: [], pickupOrders: [], deliveryOrders: [], dateFilter: date })

		this.allData()
		this.pickup()
		this.delivery()
	}

	//display all the data 
	allData = () => {
		firebase.database().ref('rolls').once('value', snapshot => {
			snapshot.forEach((snap) => {
				this.setState({ person: snap.key })
				snap.forEach((order) => {
					this.setState({ purchase: order.key })

					//append the products from 'Order Items' into the items array state
					if (order.hasChild('Order Items')) {
						order.forEach((details) => {
							let items = []
							details.forEach((product) => { items.push(product.val()) })
							this.setState({ items })
						})
					}

					if (order.hasChild('Order Instructions')) {
						order.child('Order Instructions').forEach((information) => {
							let instructions = []
							information.forEach((info) => { instructions.push(info.val()) })
							this.setState({ instructions })
						})
					}
					else if (!order.hasChild('Order Instructions')) {
						let instructions = []
						this.setState({ instructions })
					}

					//append all the details from 'Order Details' to the specified functions
					order.forEach((details) => {
						if (this.state.searchOrder.trim() === '') {
							if (this.state.dateFilter === '') {
								if (details.val().orderStatus === 'Not Ready') {
									if (details.val().Mode === 'Pickup') {
										this.addPickupInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
											if (item === 'P1') { return <p>6pcs</p> }
											else if (item === 'P2') { return <p>12pcs</p> }
											else if (item !== 'P1' || item !== 'P2') { 
												return (
													<div>
														{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
														{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
														{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
														{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
														{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
														{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
														{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
													</div>
												)
											}
										}), details.val().Price, details.val().PickupPayment, details.val().Date, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
											if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
											else if (item === 'Personalized') { return <p>Personalized Writing</p> }
											else if (item === 'Candle') { return <p>Candle</p> }
											else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
											else if (item === 'Frosting') { return <p>Separate Frosting</p> }
											else if (item === 'None') { return <p>None</p> }
										}))
									}
									else if (details.val().Mode === 'Delivery') {
										this.addDeliveryInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
											if (item === 'P1') { return <p>6pcs</p> }
											else if (item === 'P2') { return <p>12pcs</p> }
											else if (item !== 'P1' || item !== 'P2') { 
												return (
													<div>
														{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
														{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
														{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
														{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
														{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
														{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
														{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
													</div>
												)
											}
										}), details.val().Price, details.val().DeliveryPayment, details.val().Date, details.val().Address, details.val().City, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
											if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
											else if (item === 'Personalized') { return <p>Personalized Writing</p> }
											else if (item === 'Candle') { return <p>Candle</p> }
											else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
											else if (item === 'Frosting') { return <p>Separate Frosting</p> }
											else if (item === 'None') { return <p>None</p> }
										}))
									}
								}
								else if (details.val().orderStatus === 'Ready') { return }
							}
							else if (this.state.dateFilter !== '') {
								if (details.val().Date === moment(this.state.dateFilter).format('L')) {
									if (details.val().Mode === 'Pickup') {
										this.addPickupInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
											if (item === 'P1') { return <p>6pcs</p> }
											else if (item === 'P2') { return <p>12pcs</p> }
											else if (item !== 'P1' || item !== 'P2') { 
												return (
													<div>
														{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
														{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
														{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
														{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
														{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
														{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
														{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
													</div>
												)
											}
										}), details.val().Price, details.val().PickupPayment, details.val().Date, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
											if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
											else if (item === 'Personalized') { return <p>Personalized Writing</p> }
											else if (item === 'Candle') { return <p>Candle</p> }
											else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
											else if (item === 'Frosting') { return <p>Separate Frosting</p> }
											else if (item === 'None') { return <p>None</p> }
										}))
									}
									else if (details.val().Mode === 'Delivery') {
										this.addDeliveryInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
											if (item === 'P1') { return <p>6pcs</p> }
											else if (item === 'P2') { return <p>12pcs</p> }
											else if (item !== 'P1' || item !== 'P2') { 
												return (
													<div>
														{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
														{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
														{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
														{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
														{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
														{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
														{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
														{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
														{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
														{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
														{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
														{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
													</div>
												)
											}
										}), details.val().Price, details.val().DeliveryPayment, details.val().Date, details.val().Address, details.val().City, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
											if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
											else if (item === 'Personalized') { return <p>Personalized Writing</p> }
											else if (item === 'Candle') { return <p>Candle</p> }
											else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
											else if (item === 'Frosting') { return <p>Separate Frosting</p> }
											else if (item === 'None') { return <p>None</p> }
										}))
									}
								}
								else if (details.val().Date !== moment(this.state.dateFilter).format('L')) { return }
							}
						}
						else if (this.state.searchOrder.trim() !== '') {
							if (this.state.purchase === this.state.searchOrder) {
								if (details.val().Mode === 'Pickup') {
									this.addPickupInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().PickupPayment, details.val().Date, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
								else if (details.val().Mode === 'Delivery') {
									this.addDeliveryInfo_All(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().DeliveryPayment, details.val().Date, details.val().Address, details.val().City, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
							}
							else if (this.state.purchase !== this.state.searchOrder) { return }
						}
					})	
				})
			})
		})
	}

	addPickupInfo_All = (consumer_id, name, number, products, amount, mode, date, instruction, description, person, order, paymentStat, orderStat, contactStat, created, frostingInstruct, multipleInstructions) => {
		let object = order
		var row = this.state.allOrders.concat(
			<tr id={object} key={created}>
				<td>{name}<br />{number}<br /><br />{consumer_id}</td>
				<td>{order}<br /><br />{created}</td>
				<td>{products}</td>
				<td>P{amount}.00</td>
				{mode === 'P_transfer' ? <td>BDO Transfer</td> : null}
				{mode === 'P_GCash' ? <td>GCash</td> : null}
				{mode === 'payOnPickup' ? <td>Payment on Pickup</td> : null}
				<td>{date}</td>
				<td>-</td>
				<td>-</td>
				<td>{instruction} {multipleInstructions}<br />{description}<br />{frostingInstruct}</td>
				<td>
					<button style={{background: paymentStat === 'Payment Confirmed' ? '#B2773C' : null}} id="paid" onClick={() => this.paid(person, order)} disabled={paymentStat === this.state.paymentStatus}>Confirm</button>
				    <button style={{background: orderStat === 'Ready' ? '#B2773C' : null}} id="done" onClick={() => this.done(person, order, object)} disabled={orderStat === this.state.orderStatus}>Complete</button>
				    <button style={{background: contactStat === true ? '#B2773C' : null}} id="contact" onClick={() => this.contact(person, order)} disabled={contactStat === this.state.contacted}>Contacted</button>
					<button onClick={() => this.remove(person, order, object)}>Remove</button>
				</td>
			</tr>
		)
		this.setState({ allOrders: row })
	}

	addDeliveryInfo_All = (consumer_id, name, number, products, amount, mode, date, address, city, instruction, description, person, order, paymentStat, orderStat, contactStat, created, frostingInstruct, multipleInstructions) => {
		let object = order
		var row = this.state.allOrders.concat(
			<tr id={object} key={created}>
				<td>{name}<br />{number}<br /><br />{consumer_id}</td>
				<td>{order}<br /><br />{created}</td>
				<td>{products}</td>
				<td>P{amount}.00</td>
				{mode === 'D_transfer' ? <td>BDO Transfer</td> : null}
				{mode === 'D_GCash' ? <td>GCash</td> : null}
				{mode === 'cod' ? <td>Cash on Delivery</td> : null}
				<td>{date}</td>
				<td>{address}</td>
				<td>{city}</td>
				<td>{instruction} {multipleInstructions}<br />{description}<br />{frostingInstruct}</td>
				<td>
					<button style={{background: paymentStat === 'Payment Confirmed' ? '#B2773C' : null}} id="paid" onClick={() => this.paid(person, order)} disabled={paymentStat === this.state.paymentStatus}>Confirm</button>
					<button style={{background: orderStat === 'Ready' ? '#B2773C' : null}} id="done" onClick={() => this.done(person, order, object)} disabled={orderStat === this.state.orderStatus}>Complete</button>
					<button style={{background: contactStat === true ? '#B2773C' : null}} id="contact" onClick={() => this.contact(person, order)} disabled={contactStat === this.state.contacted}>Contacted</button>
					<button onClick={() => this.remove(person, order, object)}>Remove</button>
				</td>
			</tr>
		)
		this.setState({ allOrders: row })
	}

	//display pickup orders 
	pickup = () => {
		firebase.database().ref('rolls').once('value', snapshot => {
			snapshot.forEach((snap) => {
				this.setState({ person: snap.key })
				snap.forEach((order) => {
					this.setState({ purchase: order.key })

					if (order.hasChild('Order Items')) {
						order.forEach((details) => {
							let items = []
							details.forEach((product) => { items.push(product.val()) })
							this.setState({ items })
						})
					}

					if (order.hasChild('Order Instructions')) {
						order.child('Order Instructions').forEach((information) => {
							let instructions = []
							information.forEach((info) => { instructions.push(info.val()) })
							this.setState({ instructions })
						})
					}
					else if (!order.hasChild('Order Instructions')) {
						let instructions = []
						this.setState({ instructions })
					}

					order.forEach((details) => {
						if (this.state.dateFilter === '') {
							if (details.val().orderStatus === 'Not Ready') {
								if (details.val().Mode === 'Pickup') {
									this.addPickupInfo_Pickup(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().PickupPayment, details.val().Date, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
								else if (details.val().Mode === 'Delivery') { return }
							}
							else if (details.val().orderStatus === 'Ready') { return }
						}
						else if (this.state.dateFilter !== '') {
							if (details.val().Date === moment(this.state.dateFilter).format('L')) {
								if (details.val().Mode === 'Pickup') {
									this.addPickupInfo_Pickup(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().PickupPayment, details.val().Date, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
								else if (details.val().Mode === 'Delivery') { return }
							}
							else if (details.val().Date !== moment(this.state.dateFilter).format('L')) { return }
						}	
					})	
				})
			})
		})	
	}

	addPickupInfo_Pickup = (consumer_id, name, number, products, amount, mode, date, instruction, description, person, order, paymentStat, orderStat, contactStat, created, frostingInstruct, multipleInstructions) => {
		let object = order
		var row = this.state.pickupOrders.concat(
			<tr id={object} key={created}>
				<td>{name}<br />{number}<br /><br />{consumer_id}</td>
				<td>{order}<br /><br />{created}</td>
				<td>{products}</td>
				<td>P{amount}.00</td>
				{mode === 'P_transfer' ? <td>BDO Transfer</td> : null}
				{mode === 'P_GCash' ? <td>GCash</td> : null}
				{mode === 'payOnPickup' ? <td>Payment on Pickup</td> : null}
				<td>{date}</td>
				<td>-</td>
				<td>-</td>
				<td>{instruction} {multipleInstructions}<br />{description}<br />{frostingInstruct}</td>
				<td>
					<button style={{background: paymentStat === 'Payment Confirmed' ? '#B2773C' : null}} id="paid" onClick={() => this.paid(person, order)} disabled={paymentStat === this.state.paymentStatus}>Confirm</button>
				    <button style={{background: orderStat === 'Ready' ? '#B2773C' : null}} id="done" onClick={() => this.done(person, order, object)} disabled={orderStat === this.state.orderStatus}>Complete</button>
				    <button style={{background: contactStat === true ? '#B2773C' : null}} id="contact" onClick={() => this.contact(person, order)} disabled={contactStat === this.state.contacted}>Contacted</button>
					<button onClick={() => this.remove(person, order, object)}>Remove</button>
				</td>
			</tr>
		)
		this.setState({ pickupOrders: row })
	}

	//display delivery orders
	delivery = () => {
		firebase.database().ref('rolls').once('value', snapshot => {
			snapshot.forEach((snap) => {
				this.setState({ person: snap.key })
				snap.forEach((order) => {
					this.setState({ purchase: order.key })

					if (order.hasChild('Order Items')) {
						order.forEach((details) => {
							let items = []
							details.forEach((product) => { items.push(product.val()) })
							this.setState({ items })
						})
					}

					if (order.hasChild('Order Instructions')) {
						order.child('Order Instructions').forEach((information) => {
							let instructions = []
							information.forEach((info) => { instructions.push(info.val()) })
							this.setState({ instructions })
						})
					}
					else if (!order.hasChild('Order Instructions')) {
						let instructions = []
						this.setState({ instructions })
					}
					
					order.forEach((details) => {
						if (this.state.dateFilter === '') {
							if (details.val().orderStatus === 'Not Ready') {
								if (details.val().Mode === 'Delivery') {
									this.addDeliveryInfo_Delivery(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().DeliveryPayment, details.val().Date, details.val().Address, details.val().City, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
								else if (details.val().Mode === 'Pickup') { return }
							}
							else if (details.val().orderStatus === 'Ready') { return }
						}
						else if (this.state.dateFilter !== '') {
							if (details.val().Date === moment(this.state.dateFilter).format('L')) {
								if (details.val().Mode === 'Delivery') {
									this.addDeliveryInfo_Delivery(details.val().Consumer, details.val().Name, details.val().Number, this.state.items.map(item => {
										if (item === 'P1') { return <p>6pcs</p> }
										else if (item === 'P2') { return <p>12pcs</p> }
										else if (item !== 'P1' || item !== 'P2') { 
											return (
												<div>
													{item.Product === 'P1' ? <p>6pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P2' ? <p>12pcs Classic ({item.Sets})</p> : null}
													{item.Product === 'P3' ? <p>6pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P4' ? <p>12pcs Chocolate ({item.Sets})</p> : null}
													{item.Product === 'P5' ? <p>6pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P6' ? <p>12pcs Pecan ({item.Sets})</p> : null}
													{item.Product === 'P7' ? <p>Classic Cake ({item.Sets})</p> : null}
													{item.Product === 'P8' ? <p>Choco Cake ({item.Sets})</p> : null}
													{item.Product === 'P9' ? <p>Pecan Cake ({item.Sets})</p> : null}
													{item.Product === 'P10' ? <p>6pcs Matcha ({item.Sets})</p> : null}
													{item.Product === 'P11' ? <p>Matcha Cake ({item.Sets})</p> : null}
													{item.Product === 'P12' ? <p>12pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P13' ? <p>6pcs PB&J ({item.Sets})</p> : null}
													{item.Product === 'P14' ? <p>12pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P15' ? <p>6pcs 2xStrawberry ({item.Sets})</p> : null}
													{item.Product === 'P16' ? <p>12pcs S&CC ({item.Sets})</p> : null}
													{item.Product === 'P17' ? <p>6pcs S&CC ({item.Sets})</p> : null}
												</div>
											)
										}
									}), details.val().Price, details.val().DeliveryPayment, details.val().Date, details.val().Address, details.val().City, details.val().Instructions, details.val().Note, this.state.person, this.state.purchase, details.val().paymentStatus, details.val().orderStatus, details.val().contacted, details.val().Created, details.val().FrostingInstructions, this.state.instructions.map(item => { 
										if (item === 'extraFrosting') { return <p>Extra Frosting</p>}
										else if (item === 'Personalized') { return <p>Personalized Writing</p> }
										else if (item === 'Candle') { return <p>Candle</p> }
										else if (item === 'BirthdaySet') { return <p>BirthdaySet</p> }
										else if (item === 'Frosting') { return <p>Separate Frosting</p> }
										else if (item === 'None') { return <p>None</p> }
									}))
								}
								else if (details.val().Mode === 'Pickup') { return }
							}
							else if (details.val().Date !== moment(this.state.dateFilter).format('L')) { return }
						}	
					})	
				})
			})
		})	
	}

	addDeliveryInfo_Delivery = (consumer_id, name, number, products, amount, mode, date, address, city, instruction, description, person, order, paymentStat, orderStat, contactStat, created, frostingInstruct, multipleInstructions) => {
		let object = order
		var row = this.state.deliveryOrders.concat(
			<tr id={object} key={created}>
				<td>{name}<br />{number}<br /><br />{consumer_id}</td>
				<td>{order}<br /><br />{created}</td>
				<td>{products}</td>
				<td>P{amount}.00</td>
				{mode === 'D_transfer' ? <td>BDO Transfer</td> : null}
				{mode === 'D_GCash' ? <td>GCash</td> : null}
				{mode === 'cod' ? <td>Cash on Delivery</td> : null}
				<td>{date}</td>
				<td>{address}</td>
				<td>{city}</td>
				<td>{instruction} {multipleInstructions}<br />{description}<br />{frostingInstruct}</td>
				<td>
					<button style={{background: paymentStat === 'Payment Confirmed' ? '#B2773C' : null}} id="paid" onClick={() => this.paid(person, order)} disabled={paymentStat === this.state.paymentStatus}>Confirm</button>
					<button style={{background: orderStat === 'Ready' ? '#B2773C' : null}} id="done" onClick={() => this.done(person, order, object)} disabled={orderStat === this.state.orderStatus}>Complete</button>
					<button style={{background: contactStat === true ? '#B2773C' : null}} id="contact" onClick={() => this.contact(person, order)} disabled={contactStat === this.state.contacted}>Contacted</button>
					<button onClick={() => this.remove(person, order, object)}>Remove</button>
				</td>
			</tr>
		)
		this.setState({ deliveryOrders: row })
	}

	//table button functions
	paid = (customer, order) => {
		firebase.database().ref('rolls').child(customer).child(order).child('Order Details').update({ paymentStatus: this.state.paymentStatus })
		document.getElementById(order).querySelector('#paid').style.backgroundColor = "#B2773C"
	}

	done = (customer, order, item) => { 
		firebase.database().ref('rolls').child(customer).child(order).child('Order Details').update({ orderStatus: this.state.orderStatus })
		document.getElementById(item).style.display = 'none'
		document.getElementById(order).querySelector('#done').style.backgroundColor = "#B2773C"
	}

	contact = (customer, order) => {
		firebase.database().ref('rolls').child(customer).child(order).child('Order Details').update({ contacted: this.state.contacted })
		document.getElementById(order).querySelector('#contact').style.backgroundColor = "#B2773C"
	}

	remove = (customer, order, item) => {
		document.getElementById(item).style.display = 'none'
		firebase.database().ref('rolls').child(customer).child(order).remove()
	}

	//sort table
	sortByKey = (array) => {
	    return array.sort((a, b) => {
	        var x = a.key
	        var y = b.key
	        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	    });
	}

	render() {
		return (
			<div>
				<section id="viewing">
					<div class="containerViewing slideDown">

						<div id="adminHeader"> <h1>Viewing Panel</h1> </div>

						<div class="filter">
							<select onChange={this.handleChange} value={this.state.methodFilter} name="methodFilter">
								<option value="">--Choose Filter--</option>
								<option value="delivery">Deliveries</option>
								<option value="pickup">Pickups</option>
							</select>

							<input onChange={this.handleOrderChange} value={this.state.searchOrder} name="searchOrder" type="text" placeholder="Search Order" autocomplete="off" />

							<DatePicker inline selected={this.state.dateFilter} onChange={date => this.handleDateChange(date)} maxDate={addMonths(new Date(), 2)} format='MM-dd-yyyy' placeholderText="Date" id="filterPicker" />
						</div>

						<div class="table">
							<table class="viewingTable">
							  	<thead>
								    <tr>
								    	<th>Contact</th>
								    	<th>Order &<br />Timestamp</th>
								        <th>Item</th>
								        <th>Amount</th>
								      	<th>Mode</th>
								      	<th>Date</th>
								      	<th>Address</th>
								      	<th>City</th>
								      	<th>Instructions</th>
								      	<th></th>
								    </tr>
							  	</thead>

							  	<tbody id="dataTable">
							  		{this.state.methodFilter === '' ? this.sortByKey(this.state.allOrders) : null}
							  		{this.state.methodFilter === 'pickup' ? this.sortByKey(this.state.pickupOrders) : null}
							  		{this.state.methodFilter === 'delivery' ? this.sortByKey(this.state.deliveryOrders) : null}
							  	</tbody>
									
							</table>
						</div>
					</div>
				</section>
			</div>
		)
	}
}

export default View