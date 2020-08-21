import React from 'react'
import { ActivityItem, Icon, Link, mergeStyleSets, Spinner, SpinnerSize } from 'office-ui-fabric-react'
import moment from 'moment'
import axios from 'axios'

var parse = require('html-react-parser')

const classNames = mergeStyleSets({
    exampleRoot: {
        marginTop: '10px',
    },
    nameText: {
        fontWeight: 'bold',
    },
})

class ActivityItemBasicExample extends React.Component {
    constructor(props) {
        super(props)
        this.state = { items: undefined }
    }
    componentDidMount() {
        var self = this
        axios.get(`http://app.frame-house.eu/php/activity.php?cid=${this.props.cid}`)
            .then(function (response) {
                self.setState({ items: response.data })
            })
    }
    stringToHTML = function (str) {
        var dom = document.createElement('span');
        dom.innerHTML = str;
        return dom;
    }
    render() {
        console.log(this.state.items)
        if (this.state.items) {
            return (
                <div>
                    {
                        this.state.items.map((item) => (
                            <ActivityItem
                                {...item}
                                activityIcon={<Icon iconName={item.icon ? item.icon : 'Embed'} />}
                                activityDescription={[
                                    <Link key={1} className={classNames.nameText} onClick={() => { alert('A name was clicked.') }}>{item.user_name}</Link>,
                                    <span key={2}> {parse(item.activity)} </span>,
                                    <span key={3} className={classNames.nameText}>{item.customer_name}</span>
                                ]}
                                key={item.id}
                                className={classNames.exampleRoot}
                                timeStamp={moment.unix(item.timestamp).format("LLLL")}
                            />
                        ))
                    }
                </div >
            )
        } else {
            return <Spinner size={SpinnerSize.medium} />
        }

    }
}

export default ActivityItemBasicExample