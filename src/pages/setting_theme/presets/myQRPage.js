import { bottomBarJson } from './layout'

const myQRPageJson = {
	type: 'div',
	props: {
		style: {
			display: 'flex',
			flexDirection: 'column',
			height: '100dvh',
			width: '100%',
			overflow: 'hidden',
		},
		children: [
			// Navbar
			{
				// Navbar
				type: 'div',
				props: {
					style: {
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: 56,
						zIndex: 900,
						boxSizing: 'border-box',
					},
					children: [
						{
							// Navbar

							type: 'div',
							props: {
								style: {
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'center',
									width: '100%',
									backgroundColor: '#ffffff',
									height: 56,
									color: '#00000059',
									boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
									boxSizing: 'border-box',
								},
								children: {
									type: 'div',
									props: {
										onClick: {
											isJS: true,
											__key: '()=>{defualtAppZap?.setTab("HOME");}',
										},
										style: {
											width: '60px',
											height: '100%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											border: '1px solid rgba(0,0,0,0.1)',
											backgroundColor: 'rgba(0,0,0,0.1)',
										},
										children: {
											type: 'i',
											props: {
												className: 'fa-solid fa-angle-left',
											},
										},
									},
								},
							},
						},
					],
				},
			},

			// content
			{
				// content
				type: 'div',
				props: {
					style: {
						flex: 1,
						overflowY: 'scroll',
						overflowX: 'hidden',
					},
					children: [
						{
							// content
							type: 'div',
							props: {
								style: {
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								},
								children: [
									{
										// content
										type: 'div',
										props: {
											style: {
												fontSize: 24,
												fontWeight: 'bold',
												padding: 10,
												textAlign: 'center',
											},
											children: 'ສະແກນ QR code ແລະ ສັ່ງອາຫານທີ່ເຈົ້າມັກ',
										},
									},
									{
										// content
										type: 'div',
										props: {
											style: {
												width: '90%',
												maxWidth: '340px',
												// height: '290px',
											},
											children: [
												{
													// content
													type: 'img',
													props: {
														style: {
															width: '100%',
															height: '100%',
															objectFit: 'cover',
														},
														src: {
															isJS: true,
															__key:
																"'https://app-api.appzap.la/qr-gennerate/qr?data=qr&chl=https://client.appzap.la/store/' + defualtAppZap?.storeDetail?._id + '?token=' + defualtAppZap?.token",
														},
													},
												},
											],
										},
									},
									{
										// content
										type: 'div',
										props: {
											style: { textAlign: 'center', padding: 10 },
											children:
												'ກະລຸນາ ຢ່າເປີດເຜີຍ ໃຫ້ບຸກຄົນທີ່ບໍ່ໄດ້ນັ່ງໂຕະດຽວກັບທ່ານ',
										},
									},
								],
							},
						},
					],
				},
			},

			// Bottom bar
			bottomBarJson,
		],
	},
}

export default myQRPageJson
