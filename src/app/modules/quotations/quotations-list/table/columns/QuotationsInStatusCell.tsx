// import { FC, useMemo } from 'react'
// import { ID } from '../../../../../../_metronic/helpers'
// import { useListView } from '../../core/ListViewProvider'

// type Props = {
//   id: ID,
//   lock: boolean
// }

// const QuotationsSelectionCell: FC<Props> = ({ id, lock }) => {
//   const { selected, onSelect } = useListView()
//   const isSelected = useMemo(() => selected.includes(id), [id, selected])
//   return (
//     <div className='form-check form-check-sm form-check-custom form-check-solid'>

//       <input
//         className='form-check-input'
//         type='checkbox'
//         id={'box-round'}
//         data-kt-check={isSelected}
//         disabled={lock}
//         onClick={(event) => {
//           event.stopPropagation(); 
//         }}
//         data-kt-check-target='#kt_table_users .form-check-input'
//         checked={lock === false ? isSelected : lock}
//         onChange={() => {
//           onSelect(id)}}
//       />
//       <div id="tick_mark"></div>

//     </div>
//   )
// }

// export { QuotationsSelectionCell }


import { FC } from 'react'
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";
import { array } from 'yup';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { CircularProgressbar } from 'react-circular-progressbar';

type Props = {
  quotations: Array<{
    desc: string,
    amount: number
  }>
  payment_term?: Array<{
    percentage: number,
    desc: string,
    amount: number,
    date: string
  }>
  balancePaid?: number
}

const QuotationsInStatusCell: FC<Props> = ({ balancePaid, payment_term, quotations }) => {

  var total = 0
  var next_payment_date = ''
  var numberDate1 = 0


  var date2 = new Date();
  var numberDate2 = parseInt(date2.toISOString().slice(0, 10).replace(/-/g, ""));
  // number 20180610

  var diff1 = new Date()
  var diff2 = new Date(date2.toISOString().slice(0, 10))

  var cyclePayment = 0

  quotations?.forEach((element: any) => {
    total += element.amount
  })

  if (payment_term !== undefined) {
    var tempCount = 0

    for (let i = 0; i < payment_term.length; i++) {

      tempCount += payment_term[i].amount


      diff1 = new Date(payment_term[i].date)

      next_payment_date = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(payment_term[i].date))

      numberDate1 = Number(next_payment_date.split('/').reverse().join(''));
      //number 20180605

      cyclePayment = payment_term[i].amount

      if (balancePaid !== undefined) {
        if (balancePaid < tempCount && numberDate2 <= numberDate1) {
          break
        }
        else if (balancePaid >= tempCount && numberDate2 <= numberDate1) {
          continue
        }
      }
    }
  }

  // To calculate the time difference of two dates
  var Difference_In_Time = diff1.getTime() - diff2.getTime();

  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return (
    <div style={{ paddingRight: 20, paddingLeft: 20 }}>
      {/* {(balancePaid ? balancePaid : 0) >= total ? <></> : <p style={{ fontSize: 'x-small' }} className='mt-5'>Next Payment: {next_payment_date} {Difference_In_Days > 7 ? <></> : (Difference_In_Days <= 7 && Difference_In_Days > 3) ? <img style={{ paddingBottom: 3 }} src={toAbsoluteUrl('/media/icons/duotune/general/caution.png')} className='' alt='' /> : <img style={{ paddingBottom: 3 }} src={toAbsoluteUrl('/media/icons/duotune/general/warning.png')} className='' alt='' />}
      </p>} */}
      {/* {(balancePaid ? balancePaid : 0) >= total ? <></> : <p style={{ fontSize: 'x-small' }} className='mt-5'>Balance cycle: {cyclePayment - (balancePaid?balancePaid:0)}</p>} */}

      <div style={{ width: 100, height: 100, marginBottom: 5 }}>
        <CircularProgressbar value={balancePaid ? balancePaid / total * 100 : 0} text={`${Math.floor((balancePaid ? balancePaid / total * 100 : 0) * 100) / 100}%`} />

      </div>

      {/* <ProgressBar
        percent={balancePaid ? balancePaid / total * 100 : 0}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      // text=''
      /> */}
      {total === balancePaid ? <i style={{ fontSize: 'x-small' }}>Completed</i> :
        <i style={{ fontSize: 'x-small' }}>RM {total - (balancePaid ? balancePaid : 0)} remaining</i>}


    </div>
  )
}

export { QuotationsInStatusCell }

