from psycopg2 import sql

import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_all_columns():
    """
    get all statuses(column names + id)
    """
    columns = data_manager.execute_select(
        """
        SELECT * FROM statuses;
        """)

    return columns


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})
    return matching_cards


def get_card_order(board_id, status_id):
    card_order = data_manager.execute_select(
        sql.SQL("""
        SELECT MAX(card_order) FROM cards
        WHERE cards.board_id = {board_id} AND cards.status_id = {column_id}
        ;
        """).format(
            board_id=sql.Literal(board_id),
            column_id=sql.Literal(status_id)
        )
    )
    return card_order[0]['max']


def get_max_id_card():
    last_card = data_manager.execute_select(
        """
        SELECT id FROM cards
        ORDER BY id DESC
        LIMIT 1
        ;
        """)
    return last_card[0]['id']


def get_max_id_status():
    last_status = data_manager.execute_select(
        """
        SELECT id FROM statuses
        ORDER BY id DESC
        LIMIT 1
        ;
        """)
    return last_status[0]['id']


def get_max_id_board():
    last_board = data_manager.execute_select(
        """
        SELECT id FROM boards
        ORDER BY id DESC
        LIMIT 1
        ;
        """)
    return last_board[0]['id']


@data_manager.connection_handler
def add_new_card(cursor, data):
    cursor.execute(
        sql.SQL("""
        INSERT INTO cards(title, board_id, status_id, card_order)
        VALUES ({title},{board_id},{status_id},{card_order})
        """).format(
            title=sql.Literal(data[0]),
            board_id=sql.Literal(data[1]),
            status_id=sql.Literal(data[2]),
            card_order=sql.Literal(data[3])
        )
    )


@data_manager.connection_handler
def add_new_status(cursor, data):
    cursor.execute(
        sql.SQL("""
        INSERT INTO statuses(title, owner)
        VALUES ({title},{table})
        """).format(
            title=sql.Literal(data[0]),
            table=sql.Literal(data[1])
        )
    )


@data_manager.connection_handler
def add_new_board(cursor, data):
    cursor.execute(
        sql.SQL("""
        INSERT INTO boards(title)
        VALUES ({title})
        """).format(
            title=sql.Literal(data)
        )
    )


@data_manager.connection_handler
def delete_board_by_id(cursor, board_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM boards
            WHERE id={board_id}
        """).format(
                    board_id=sql.Literal(board_id)
        )
    )


@data_manager.connection_handler
def delete_all_cards_by_board_id(cursor, board_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM cards
            WHERE board_id={board_id}
        """).format(
                    board_id=sql.Literal(board_id)
        )
    )


@data_manager.connection_handler
def delete_all_statuses_by_board_id(cursor, board_id):
    cursor.execute(
        sql.SQL("""
            DELETE FROM statuses
            WHERE owner={board_id}
        """).format(
            board_id=sql.Literal(board_id)
        )
    )

