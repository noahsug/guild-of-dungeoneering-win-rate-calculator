import React from 'react'
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';
import classNames from 'classnames/bind'
import style from './AppFooter.scss'

const cx = classNames.bind(style)

const githubUrl =
    'https://github.com/noahsug/guild-of-dungeoneering-win-rate-calculator'

const AppFooter = () => (
  <div className={cx('content')}>
    <Navigation type="horizontal">
      <Link
        href="mailto:noahsug+god@gmail.com"
        target="_blank"
        label="Created by Noah Sugarman"
        icon="email"
      />
      <Link
        href={githubUrl}
        target="_blank"
        label="Source Code"
        icon="code"
      />
      <Link
        href={`${githubUrl}/issues`}
        target="_blank"
        label="Report an Issue"
        icon="warning"
      />
    </Navigation>
  </div>
)

export default AppFooter
