import styles from './loader.module.css';

export function Loader() {
  return (
    <div>
      <div className={styles.container}>
        <div className={`${styles.dot} ${styles['dot-1']}`}></div>
        <div className={`${styles.dot} ${styles['dot-2']}`}></div>
        <div className={`${styles.dot} ${styles['dot-3']}`}></div>
      </div>

      <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
        <defs>
          <filter id='goo'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
            <feColorMatrix
              in='blur'
              mode='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7'
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
