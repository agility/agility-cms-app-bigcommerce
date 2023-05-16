import classNames from 'classnames'
import './globals.css'
import { Mulish } from 'next/font/google'

const mulish = Mulish({subsets: ["latin"]})

export const metadata = {
  title: 'Agility CMS BigCommerce App',
  description: 'Connect your BigCommerce store to Agility CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<html lang="en">
			<body className={classNames(mulish.className, "bg-white")}>{children}</body>
		</html>
	)
}
